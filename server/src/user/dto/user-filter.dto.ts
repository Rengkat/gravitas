import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  IsString,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  UserRole,
  SubscriptionTier,
  NigerianState,
  Gender,
} from 'src/common/enums';

// ─────────────────────────────────────────────
// USER FILTER DTO
// Who calls it: Super Admin via GET /users?role=student&state=Lagos
// What it does: Paginated, filterable list of all users.
// ─────────────────────────────────────────────
export class UserFilterDto {
  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    enum: SubscriptionTier,
    description: 'Filter by subscription plan',
  })
  @IsOptional()
  @IsEnum(SubscriptionTier)
  subscriptionTier?: SubscriptionTier;

  @ApiPropertyOptional({
    enum: NigerianState,
    description: 'Filter by state of residence',
  })
  @IsOptional()
  @IsEnum(NigerianState)
  state?: NigerianState;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter active/inactive accounts',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter email-verified accounts',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  emailVerified?: boolean;

  @ApiPropertyOptional({
    example: 'adaeze',
    description: 'Full-text search across firstName, lastName, email, phone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Filter users created on or after this date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Filter users created on or before this date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    enum: [
      'createdAt',
      'firstName',
      'lastName',
      'email',
      'streakCount',
      'xpPoints',
    ],
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsString()
  sortBy?:
    | 'createdAt'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'streakCount'
    | 'xpPoints' = 'createdAt';

  @ApiPropertyOptional({
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    description: 'Sort direction',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page (max 100)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;
}

// ─────────────────────────────────────────────
// STUDENT FILTER DTO
// Who calls it:
//   - Super Admin: GET /users?role=student (uses UserFilterDto above)
//   - School Admin: GET /school/students (scoped to their school)
// ─────────────────────────────────────────────
export class StudentFilterDto {
  @ApiPropertyOptional({
    example: 'adaeze',
    description: 'Search by name, email, or admission number',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'uuid-of-class',
    description: 'Filter by class ID',
  })
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'averageScore',
    enum: [
      'firstName',
      'lastName',
      'averageScore',
      'streakCount',
      'enrolledAt',
    ],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'firstName';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;
}

// ─────────────────────────────────────────────
// TUTOR FILTER DTO
// Who calls it: Any authenticated user browsing tutors
//   via GET /tutors
// ─────────────────────────────────────────────
export class TutorFilterDto {
  @ApiPropertyOptional({
    example: 'physics',
    description: 'Subject slug to filter by',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ enum: NigerianState })
  @IsOptional()
  @IsEnum(NigerianState)
  state?: NigerianState;

  @ApiPropertyOptional({ example: 'Surulere' })
  @IsOptional()
  @IsString()
  lga?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Only show verified tutors',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isVerified?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Only show currently online tutors',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isOnline?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter tutors who teach online',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  canTeachOnline?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter tutors who teach in-person',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  canTeachInPerson?: boolean;

  @ApiPropertyOptional({
    example: 5000,
    description: 'Maximum hourly rate in Naira (₦)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  maxHourlyRate?: number;

  @ApiPropertyOptional({ example: 4.0, description: 'Minimum rating (0–5)' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minRating?: number;

  @ApiPropertyOptional({
    example: 'rating',
    enum: ['rating', 'hourlyRate', 'totalSessions', 'experience'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'rating';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;
}
