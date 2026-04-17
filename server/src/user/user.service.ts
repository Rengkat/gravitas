import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // FIND HELPERS — used internally + by AuthService
  // ══════════════════════════════════════════

  //  * Default: does NOT select sensitive columns (passwordHash etc).

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
