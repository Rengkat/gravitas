import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import {
  BulkCreateUsersDto,
  BulkCreateUserRowDto,
  BulkCreateUsersResponseDto,
  GeneratedPasswordDto,
} from '../dto/create-user.dto';
import { HashProvider } from 'src/auth/providers/Hash.provider';
import { AuthProvider, UserRole } from 'src/common/enums/enums';

@Injectable()
export class BulkCreateUsersProvider {
  private readonly logger = new Logger(BulkCreateUsersProvider.name);
  private readonly CHUNK_SIZE = 50;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(HashProvider)
    private readonly hashProvider: HashProvider,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: BulkCreateUsersDto): Promise<BulkCreateUsersResponseDto> {
    const result: BulkCreateUsersResponseDto = {
      created: 0,
      skipped: 0,
      failed: 0,
      errors: [],
      generatedPasswords: [],
    };

    const chunks = this.chunk(dto.users, this.CHUNK_SIZE);

    for (const chunk of chunks) {
      await this.processChunk(chunk, dto, result);
    }

    this.logger.log(
      `Bulk create complete — created: ${result.created}, ` +
        `skipped: ${result.skipped}, failed: ${result.failed}`,
    );

    return result;
  }
  // PROCES THE CHUNK
  private async processChunk(
    rows: BulkCreateUserRowDto[],
    dto: BulkCreateUsersDto,
    result: BulkCreateUsersResponseDto,
  ): Promise<void> {
    // ── 1. Collect identifiers from the chunk ──────────────────────────────
    const emails = rows
      .map((r) => r.email?.toLowerCase().trim())
      .filter((email): email is string => !!email);

    const phoneNumbers = rows
      .map((r) => r.phoneNumber?.trim())
      .filter((phone): phone is string => !!phone);

    // ── 2. Single duplicate-check query (skipped if no identifiers) ────────
    let existingUsers: User[] = [];

    if (emails.length > 0 || phoneNumbers.length > 0) {
      const qb = this.userRepository
        .createQueryBuilder('u')
        .select(['u.email', 'u.phoneNumber']);

      if (emails.length > 0) {
        qb.orWhere('LOWER(u.email) IN (:...emails)', { emails });
      }
      if (phoneNumbers.length > 0) {
        qb.orWhere('u.phoneNumber IN (:...phoneNumbers)', { phoneNumbers });
      }

      existingUsers = await qb.getMany();
    }

    const existingEmails = new Set(
      existingUsers
        .map((u) => u.email?.toLowerCase().trim())
        .filter((e): e is string => !!e),
    );
    const existingPhones = new Set(
      existingUsers
        .map((u) => u.phoneNumber?.trim())
        .filter((p): p is string => !!p),
    );

    // ── 3. Classify each row: fail | skip | create ─────────────────────────
    const toCreate: BulkCreateUserRowDto[] = [];

    for (const row of rows) {
      const email = row.email?.toLowerCase().trim();
      const phone = row.phoneNumber?.trim();

      // Row must have at least one identifier
      if (!email && !phone) {
        result.failed++;
        result.errors.push('Row missing both email and phone — skipped');
        continue;
      }

      // Collect ALL duplicate reasons before deciding what to do
      const duplicateReasons: string[] = [];

      if (email && existingEmails.has(email)) {
        duplicateReasons.push(`email ${email} already exists`);
      }
      if (phone && existingPhones.has(phone)) {
        duplicateReasons.push(`phone ${phone} already exists`);
      }

      if (duplicateReasons.length > 0) {
        if (dto.skipDuplicates) {
          result.skipped++;
        } else {
          result.failed++;
          result.errors.push(`Row rejected — ${duplicateReasons.join(', ')}`);
        }
        continue;
      }

      toCreate.push(row);
    }

    if (toCreate.length === 0) return;

    // ── 4. Hash passwords in parallel before opening the transaction ────────
    const usersToInsert = await Promise.all(
      toCreate.map(async (row) => {
        try {
          // Track whether the password was auto-generated
          const wasGenerated = !row.password;
          const rawPassword = row.password ?? this.generateTempPassword();
          const passwordHash =
            await this.hashProvider.hashPassword(rawPassword);

          // Store the generated password in the result so the caller
          //    can send it to the student via email/SMS
          if (wasGenerated) {
            result.generatedPasswords.push({
              identifier: row.email || row.phoneNumber || 'unknown',
              temporaryPassword: rawPassword,
            });
          }

          return this.userRepository.create({
            firstName: row.firstName.trim(),
            lastName: row.lastName.trim(),
            middleName: row.middleName?.trim() ?? null,
            email: row.email?.toLowerCase().trim() ?? null,
            phoneNumber: row.phoneNumber?.trim() ?? null,
            passwordHash,
            role: row.role ?? UserRole.STUDENT,
            stateOfResidence: row.stateOfResidence ?? null,
            lga: row.lga ?? null,
            isEmailVerified: false,
            isActive: true,
            authProvider: AuthProvider.EMAIL,
          });
        } catch (err) {
          result.failed++;
          result.errors.push(
            // ✅ consistent 'unknown' fallback across ALL error paths
            `${row.email || row.phoneNumber || 'unknown'}: failed to prepare — ${(err as Error).message}`,
          );
          return null;
        }
      }),
    );

    // ── 5. Filter out rows that failed preparation ─────────────────────────
    const validUsers = usersToInsert.filter((u): u is User => u !== null);
    if (validUsers.length === 0) return;

    // ── 6. Attempt bulk insert inside a transaction ────────────────────────
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.save(User, validUsers);
      });
      result.created += validUsers.length;
    } catch (bulkErr) {
      // Bulk insert failed — fall back to row-by-row so one bad row
      // doesn't silently discard the rest of the chunk
      this.logger.warn(
        `Chunk bulk insert failed — falling back to row-by-row: ${(bulkErr as Error).message}`,
      );

      for (const user of validUsers) {
        try {
          await this.userRepository.save(user);
          result.created++;
        } catch (rowErr) {
          result.failed++;
          result.errors.push(
            `${user.email || user.phoneNumber || 'unknown'}: ${(rowErr as Error).message}`,
          );
        }
      }
    }
  }

  private chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private generateTempPassword(): string {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    const random = Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
    return `Gravitas@${year}${random}`;
  }
}
