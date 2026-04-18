import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsArray,
  IsUUID,
  Min,
  Max,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ExamType,
  DifficultyLevel,
  SubscriptionTier,
  // NigerianState,
  // SubscriptionTier,
} from 'src/common/enums';
import { CreateUserDto } from './create-user.dto';
import { UserResponseDto } from './user-response.dto';

// ─────────────────────────────────────────────
// CREATE STUDENT DTO
// Who calls it:
//   1. Student self-registers via POST /auth/register (role = STUDENT)
//   2. School admin enrolls a student via POST /school/students
//   3. Super Admin creates student via POST /users
//
// The base CreateUserDto handles all common fields.
// This adds student-specific fields.
export class CreateStudentDto extends CreateUserDto {
  @ApiPropertyOptional({ example: 'Kings College Lagos' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  school?: string;

  @ApiPropertyOptional({ example: 2026 })
  @IsOptional()
  @IsInt()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 10)
  graduationYear?: number;

  @ApiPropertyOptional({
    enum: ExamType,
    isArray: true,
    example: [ExamType.JAMB, ExamType.WAEC],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ExamType, { each: true })
  examTypes?: ExamType[];

  @ApiPropertyOptional({
    type: [String],
    example: ['physics', 'mathematics', 'chemistry'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @ApiPropertyOptional({
    example: 320,
    description: 'JAMB target score (0–400)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(400)
  targetScore?: number;

  // ── School portal fields ───────────────────────────────────────────────
  @ApiPropertyOptional({ example: 'KCL/SS2A/2025/042' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  admissionNo?: string;

  @ApiPropertyOptional({ example: 'Mrs. Ngozi Okonkwo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  parentName?: string;

  @ApiPropertyOptional({ example: '+2348098765432' })
  @IsOptional()
  @Matches(/^\+234[0-9]{10}$/)
  parentPhone?: string;

  @ApiPropertyOptional({ example: 'uuid-of-school-class' })
  @IsOptional()
  @IsUUID('4')
  schoolClassId?: string;
}
// ─────────────────────────────────────────────
// UPDATE STUDENT DTO
// Student updates their own exam preferences.
// ─────────────────────────────────────────────
export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 'Kings College Lagos' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  school?: string;

  @ApiPropertyOptional({ example: 2026 })
  @IsOptional()
  @IsInt()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 10)
  graduationYear?: number;

  @ApiPropertyOptional({ enum: ExamType, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(ExamType, { each: true })
  examTypes?: ExamType[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @ApiPropertyOptional({ example: 320 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(400)
  targetScore?: number;
}

// ─────────────────────────────────────────────
// STUDENT RESPONSE DTO
// What the API returns for student users.
// Extends UserResponseDto with student-specific fields.
// ─────────────────────────────────────────────
export class StudentResponseDto extends UserResponseDto {
  @Expose()
  @ApiPropertyOptional({ example: 'KCL/SS2A/2025/042' })
  admissionNo?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Kings College Lagos' })
  school?: string;

  @Expose()
  @ApiPropertyOptional({ example: 2026 })
  graduationYear?: number;

  @Expose()
  @ApiPropertyOptional({ enum: ExamType, isArray: true })
  examTypes?: ExamType[];

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  subjects?: string[];

  @Expose()
  @ApiProperty({ example: 14 })
  streakCount!: number;

  @Expose()
  @ApiProperty({ example: 1200 })
  xpPoints!: number;

  @Expose()
  @ApiPropertyOptional({ example: 320 })
  targetScore?: number;

  // Stats (populated from UserProgress records)
  @Expose()
  @ApiProperty({ example: 42 })
  totalSessions!: number;

  @Expose()
  @ApiProperty({ example: 67.4 })
  averageScore!: number;

  @Expose()
  @ApiPropertyOptional({ enum: DifficultyLevel })
  performanceLevel?: DifficultyLevel;
}
