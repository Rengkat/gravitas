import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import {
  Gender,
  NigerianState,
  SubscriptionTier,
  UserRole,
} from 'src/common/enums';

/**
 * UserResponseDto — the shape returned in every API response.
 *
 * Rules:
 *  - Never include passwordHash, otpCode, refreshToken, or resetToken
 *  - Use @Expose() + ClassSerializerInterceptor to strip @Exclude() fields
 *  - Extend this for role-specific responses (StudentResponseDto etc.)
 */
@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: 'uuid-v4' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Adaeze' })
  firstName!: string;

  @Expose()
  @ApiProperty({ example: 'Okonkwo' })
  lastName!: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Chiamaka' })
  middleName?: string;

  /** Computed from firstName + middleName + lastName */
  @Expose()
  @ApiProperty({ example: 'Adaeze Chiamaka Okonkwo' })
  get fullName(): string {
    return [this.firstName, this.middleName, this.lastName]
      .filter(Boolean)
      .join(' ');
  }

  @Expose()
  @ApiProperty({ example: 'adaeze@example.com' })
  email!: string;

  @Expose()
  @ApiPropertyOptional({ example: '+2348012345678' })
  phoneNumber?: string;

  @Expose()
  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @Expose()
  @ApiProperty({ enum: SubscriptionTier })
  subscriptionTier!: SubscriptionTier;

  @Expose()
  @ApiProperty({ example: true })
  isActive!: boolean;

  @Expose()
  @ApiProperty({ example: true })
  emailVerified!: boolean;

  @Expose()
  @ApiProperty({ example: false })
  phoneVerified!: boolean;

  @Expose()
  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/gravitas/avatar.jpg',
  })
  avatar?: string;

  @Expose()
  @ApiPropertyOptional({ example: '2000-08-14T00:00:00.000Z' })
  dateOfBirth?: Date;

  @Expose()
  @ApiPropertyOptional({ enum: Gender })
  gender?: Gender;

  @Expose()
  @ApiPropertyOptional({ enum: NigerianState })
  stateOfOrigin?: NigerianState;

  @Expose()
  @ApiPropertyOptional({ enum: NigerianState })
  stateOfResidence?: NigerianState;

  @Expose()
  @ApiPropertyOptional({ example: 'Surulere' })
  lga?: string;

  @Expose()
  @ApiProperty({ example: 14 })
  streakCount!: number;

  @Expose()
  @ApiProperty({ example: 1200 })
  xpPoints!: number;

  @Expose()
  @ApiPropertyOptional()
  lastActiveAt?: Date;

  @Expose()
  @ApiProperty()
  createdAt!: Date;

  @Expose()
  @ApiProperty()
  updatedAt!: Date;
}

/**
 * UserSummaryDto — lightweight version for lists and dropdowns.
 * Use this instead of UserResponseDto wherever you don't need all fields.
 */
export class UserSummaryDto {
  @ApiProperty() id!: string;
  @ApiProperty() firstName!: string;
  @ApiProperty() lastName!: string;
  @ApiProperty() email!: string;
  @ApiPropertyOptional() avatar?: string;
  @ApiProperty({ enum: UserRole }) role!: UserRole;
  @ApiProperty() isActive!: boolean;
}
