import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { SubscriptionTier, UserRole } from 'src/common/enums';
import { BaseUserDto } from './base-user.dto';

// ─────────────────────────────────────────────
// CREATE USER DTO
// Who calls it: Super Admin via POST /users
// What it does: Admin creates any user directly.
//   - No OTP step needed (admin sets emailVerified)
//   - Password is optional — auto-generated if omitted
//   - Role is required — determines which extra fields matter
// ─────────────────────────────────────────────
export class CreateUserDto extends BaseUserDto {
  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @IsEnum(UserRole)
  role!: UserRole;

  /**
   * Optional. If omitted, a secure temp password is auto-generated
   * and emailed to the user. Format: Gravitas@{year}{random6chars}
   */
  @ApiPropertyOptional({ example: 'TempPass123!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and a number',
  })
  password?: string;

  @ApiPropertyOptional({
    enum: SubscriptionTier,
    default: SubscriptionTier.FREE,
    description: 'Assign a subscription tier at creation time',
  })
  @IsOptional()
  @IsEnum(SubscriptionTier)
  subscriptionTier?: SubscriptionTier = SubscriptionTier.FREE;

  /**
   * Skip OTP verification for this user.
   * Use when importing already-verified users from another system.
   * Default: false
   */
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  skipEmailVerification?: boolean = false;

  /**
   * Send a welcome email with login instructions.
   * Set false when bulk-importing to avoid email spam.
   * Default: true
   */
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value !== false && value !== 'false')
  sendWelcomeEmail?: boolean = true;
}

// ─────────────────────────────────────────────
// BULK CREATE USER ROW DTO
// One row in a bulk import request.
// Inherits all base fields. Password defaults to generated value.
// ─────────────────────────────────────────────
export class BulkCreateUserRowDto extends BaseUserDto {
  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.STUDENT,
    description: 'Defaults to STUDENT if omitted',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.STUDENT;

  @ApiPropertyOptional({
    enum: SubscriptionTier,
    default: SubscriptionTier.FREE,
  })
  @IsOptional()
  @IsEnum(SubscriptionTier)
  subscriptionTier?: SubscriptionTier = SubscriptionTier.FREE;

  /**
   * If omitted: Gravitas@{year}{random6} is used.
   * User should be forced to change on first login.
   */
  @ApiPropertyOptional({ example: 'TempPass123!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  /** School/institution admission or registration number */
  @ApiPropertyOptional({ example: 'KCL/SS2A/2025/042' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  admissionNo?: string;

  /** Parent/guardian name — for STUDENT role */
  @ApiPropertyOptional({ example: 'Mrs. Ngozi Okonkwo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  parentName?: string;

  /** Parent WhatsApp number — for weekly report delivery */
  @ApiPropertyOptional({ example: '+2348098765432' })
  @IsOptional()
  @Matches(/^\+234[0-9]{10}$/)
  parentPhone?: string;
}

// ─────────────────────────────────────────────
// BULK CREATE USERS DTO
// Wraps an array of user rows. Max 500 per request.
// ─────────────────────────────────────────────
export class BulkCreateUsersDto {
  @ApiProperty({
    type: [BulkCreateUserRowDto],
    description: 'Array of users to import. Max 500 per request.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500, { message: 'Maximum 500 users per bulk request' })
  @ValidateNested({ each: true })
  @Type(() => BulkCreateUserRowDto)
  users!: BulkCreateUserRowDto[];

  /**
   * Silently skip rows where the email already exists.
   * If false, duplicate emails cause the entire batch to fail.
   * Default: true (recommended for large imports)
   */
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value !== false && value !== 'false')
  skipDuplicates?: boolean = true;

  /**
   * Email each created user their login details.
   * Default: false — avoid spamming on large imports.
   */
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  sendWelcomeEmails?: boolean = false;
}

export class GeneratedPasswordDto {
  @ApiPropertyOptional({ example: 'Email' })
  @IsOptional()
  @IsString()
  identifier: string;

  @ApiPropertyOptional({ example: 'Temp20241fhg' })
  @IsOptional()
  @IsString()
  temporaryPassword: string;
}

// ─────────────────────────────────────────────
// BULK CREATE RESPONSE
// ─────────────────────────────────────────────
export class BulkCreateUsersResponseDto {
  @ApiProperty({ example: 47 }) created!: number;
  @ApiProperty({ example: 2 }) skipped!: number;
  @ApiProperty({ example: 1 }) failed!: number;

  @ApiProperty({
    type: [String],
    example: ['Row 12 (bad@email): email already exists'],
  })
  errors!: string[];

  @ApiProperty({
    type: [GeneratedPasswordDto],
    example: [
      { identifier: 'ada@school.ng', temporaryPassword: 'Gravitas@2026xR3!mQ' },
      { identifier: '08012345678', temporaryPassword: 'Gravitas@2026kP9#nZ' },
    ],
  })
  generatedPasswords!: GeneratedPasswordDto[];
}
