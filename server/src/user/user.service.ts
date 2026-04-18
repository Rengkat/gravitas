import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import {
  BulkCreateUsersDto,
  BulkCreateUsersResponseDto,
  CreateUserDto,
} from './dto/create-user.dto';
import {
  AdminResetPasswordDto,
  AdminUpdateUserDto,
  ChangePasswordDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashProvider } from 'src/auth/providers/Hash.provider';
import { BulkCreateUsersProvider } from './providers/BulkCreateUsersProvider';
import {
  AuthProvider,
  SubscriptionTier,
  UserRole,
} from 'src/common/enums/enums';
import {
  CreateUserResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserFilterDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashProvider: HashProvider,

    private readonly bulkCreateUserProvider: BulkCreateUsersProvider,
  ) {}

  // FIND HELPERS — used internally + by AuthService
  // ══════════════════════════════════════════

  //  Default: does NOT select sensitive columns (passwordHash etc).

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  /**
   * Find user by email for auth purposes.
   * Selects passwordHash (excluded by default in other queries).
   * Returns null instead of throwing — caller decides how to handle.
   */
  async findByEmailForAuth(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHas')
      .addSelect('user.refreshToken') // normally excluded
      .addSelect('user.otpCode') // normally excluded
      .addSelect('user.otpExpiresAt')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  /**
   * Find by phone — for phone OTP login.
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.otpCode')
      .addSelect('user.otpExpiresAt')
      .where('user.phone = :phone', { phone })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }
  /**
   * Find by password reset token — for reset-password flow.
   */
  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordResetToken')
      .addSelect('user.passwordResetExpiresAt')
      .where('user.passwordResetToken = :token', { token })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  // PROFILE — any authenticated user
  // ══════════════════════════════════════════
  async getProfile(id: string): Promise<User> {
    return this.findById(id);
  }

  async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Map DTO field names to entity field names where they differ
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.middleName !== undefined) user.middleName = dto.middleName ?? null;
    if (dto.phoneNumber !== undefined)
      user.phoneNumber = dto.phoneNumber ?? null;
    if (dto.avatar !== undefined) user.avatarUrl = dto.avatar ?? null;
    if (dto.dateOfBirth !== undefined)
      if (dto.stateOfResidence !== undefined)
        user.stateOfResidence = dto.stateOfResidence ?? null;
    if (dto.lga !== undefined) user.lga = dto.lga ?? null;

    return this.userRepository.save(user);
  }

  async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User not found');
    if (!user.passwordHash) {
      throw new BadRequestException(
        'This account uses social login. Please use the forgot password flow to set a password.',
      );
    }

    const isCorrect = await this.hashProvider.comparePassword(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isCorrect)
      throw new BadRequestException('Current password is incorrect');

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from your current password',
      );
    }

    user.passwordHash = await this.hashProvider.hashPassword(dto.newPassword);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async deactivate(id: string): Promise<{ message: string }> {
    await this.findById(id);
    await this.userRepository.update(id, { isActive: false });
    this.logger.log(`User deactivated: ${id}`);
    return { message: 'Account deactivated successfully' };
  }

  // ADMIN — super admin operations
  // ══════════════════════════════════════════
  async createUser(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    // ── 1. Check email uniqueness ──────────────────────────────────────────
    const existing = await this.userRepository
      .createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email: dto.email })
      .getOne();

    if (existing) {
      throw new ConflictException(
        `An account with email ${dto.email} already exists`,
      );
    }

    // ── 2. Password — generate if not supplied ─────────────────────────────
    const wasGenerated = !dto.password;
    const rawPassword = dto.password ?? this.generateTempPassword();
    const passwordHash = await this.hashProvider.hashPassword(rawPassword);

    // ── 3. Build and save the user ─────────────────────────────────────────
    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName ?? null,
      email: dto.email.toLowerCase().trim(),
      phoneNumber: dto.phoneNumber ?? null,
      avatarUrl: dto.avatar ?? null,
      dateOfBirth: dto.dateOfBirth ?? null,
      gender: dto.gender ?? null,
      stateOfResidence: dto.stateOfResidence ?? null,
      lga: dto.lga ?? null,
      passwordHash,
      role: dto.role ?? UserRole.STUDENT,
      isEmailVerified: dto.skipEmailVerification ?? false,
      isActive: true,
      authProvider: AuthProvider.EMAIL,
    });

    const saved = await this.userRepository.save(user);

    this.logger.log(
      `Admin created user ${saved.id} (${saved.email}) with role ${saved.role}` +
        (wasGenerated ? ' — password was auto-generated' : ''),
    );

    const userDto = plainToInstance(UserResponseDto, saved, {
      excludeExtraneousValues: true,
    });

    return {
      user: userDto,
      ...(wasGenerated && { temporaryPassword: rawPassword }),
    };
  }

  // create bulk by admin
  async bulkCreateUsers(
    dto: BulkCreateUsersDto,
  ): Promise<BulkCreateUsersResponseDto> {
    return this.bulkCreateUserProvider.execute(dto);
  }

  async adminUpdateUser(id: string, dto: AdminUpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Profile fields
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.middleName !== undefined) user.middleName = dto.middleName ?? null;
    if (dto.phoneNumber !== undefined)
      user.phoneNumber = dto.phoneNumber ?? null;
    if (dto.avatar !== undefined) user.avatarUrl = dto.avatar ?? null;
    if (dto.dateOfBirth !== undefined)
      user.dateOfBirth = dto.dateOfBirth ?? null;
    if (dto.gender !== undefined) user.gender = dto.gender ?? null;
    if (dto.stateOfResidence !== undefined)
      user.stateOfResidence = dto.stateOfResidence ?? null;
    if (dto.lga !== undefined) user.lga = dto.lga ?? null;

    // Admin-only fields
    if (dto.email !== undefined) user.email = dto.email.toLowerCase().trim();
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.isEmailVerified !== undefined)
      user.isEmailVerified = dto.isEmailVerified;
    if (dto.isPhoneVerified !== undefined)
      user.isPhoneVerified = dto.isPhoneVerified;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    const saved = await this.userRepository.save(user);
    this.logger.log(`Admin updated user ${id}`);
    return saved;
  }

  async adminResetPassword(
    id: string,
    dto: AdminResetPasswordDto,
  ): Promise<{ message: string; tempPassword?: string }> {
    const user = await this.findById(id);

    const rawPassword = dto.newPassword ?? this.generateTempPassword();
    user.passwordHash = await this.hashProvider.hashPassword(rawPassword);

    // Force user to change on next login
    user.passwordResetToken = null;
    user.passwordResetExpiresAt = null;

    await this.userRepository.save(user);
    this.logger.log(`Admin reset password for user ${id}`);

    if (dto.notifyUser !== false) {
      // NotificationsService handles the email — injected via event or direct call at controller level
      return {
        message: `Password reset. Notification queued for ${user.email}.`,
      };
    }

    // Return temp password only when notifyUser is false (admin sees it)
    return {
      message: 'Password reset successfully.',
      tempPassword: rawPassword,
    };
  }

  async findAll(query: UserFilterDto) {
    const {
      page = 1,
      limit = 20,
      role,
      subscriptionTier,
      state,
      gender,
      isActive,
      emailVerified,
      search,
      createdFrom,
      createdTo,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL');

    // ── Filters ──────────────────────────────
    if (role) qb.andWhere('user.role = :role', { role });
    if (subscriptionTier)
      qb.andWhere('user.subscriptionTier = :subscriptionTier', {
        subscriptionTier,
      });
    if (state) qb.andWhere('user.stateOfResidence = :state', { state });
    if (gender) qb.andWhere('user.gender = :gender', { gender });

    if (isActive !== undefined) {
      qb.andWhere('user.isActive = :isActive', { isActive });
    }
    if (emailVerified !== undefined) {
      qb.andWhere('user.emailVerified = :emailVerified', { emailVerified });
    }
    if (search) {
      qb.andWhere(
        `(
          user.firstName    ILIKE :s OR
          user.lastName     ILIKE :s OR
          user.email        ILIKE :s OR
          user.phone        ILIKE :s
        )`,
        { s: `%${search}%` },
      );
    }
    if (createdFrom) {
      qb.andWhere('user.createdAt >= :createdFrom', {
        createdFrom: new Date(createdFrom),
      });
    }
    if (createdTo) {
      qb.andWhere('user.createdAt <= :createdTo', {
        createdTo: new Date(createdTo),
      });
    }

    // ── Sort ─────────────────────────────────
    const sortableFields: Record<string, string> = {
      createdAt: 'user.createdAt',
      firstName: 'user.firstName',
      lastName: 'user.lastName',
      email: 'user.email',
      streakCount: 'user.streakCount',
      xpPoints: 'user.xpPoints',
    };
    const orderField = sortableFields[sortBy] ?? 'user.createdAt';
    qb.orderBy(orderField, sortOrder);

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // return paginate(data, total, page, limit);
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
