import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashProvider } from 'src/auth/providers/Hash.provider';
import { BulkCreateUsersProvider } from './providers/BulkCreateUsersProvider';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashProvider: HashProvider,

    private readonly bulkCreateUser: BulkCreateUsersProvider,
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

  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
