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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  ExamType,
  DifficultyLevel,
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
// ─────────────────────────────────────────────
export class CreateStudentDto extends CreateUserDto {
  /**
   * Name of the school/institution the student attends.
   * Not the same as a School entity — this is a free-text field
   * for students who are not enrolled through the school portal.
   */
  @ApiPropertyOptional({ example: 'Kings College Lagos' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  school?: string;

  /** Expected year of graduation/finishing secondary school */
  @ApiPropertyOptional({ example: 2026 })
  @IsOptional()
  @IsInt()
  @Min(new Date().getFullYear())
  @Max(new Date().getFullYear() + 10)
  graduationYear?: number;

  /**
   * Exam types the student is preparing for.
   * Multiple allowed: a student can prepare for JAMB + WAEC simultaneously.
   */
  @ApiPropertyOptional({
    enum: ExamType,
    isArray: true,
    example: [ExamType.JAMB, ExamType.WAEC],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ExamType, { each: true })
  examTypes?: ExamType[];

  /**
   * Subjects the student is focusing on.
   * Uses subject slugs: 'physics', 'mathematics', etc.
   */
  @ApiPropertyOptional({
    type: [String],
    example: ['physics', 'mathematics', 'chemistry'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  /**
   * Target score the student wants to achieve.
   * Used to personalise the dashboard and set study goals.
   */
  @ApiPropertyOptional({
    example: 320,
    description: 'JAMB target score (0–400)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(400)
  targetScore?: number;

  // School portal fields — only relevant when a school admin creates the student
  /** School portal enrollment: admission/reg number */
  @ApiPropertyOptional({ example: 'KCL/SS2A/2025/042' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  admissionNo?: string;

  /** School portal enrollment: parent/guardian name */
  @ApiPropertyOptional({ example: 'Mrs. Ngozi Okonkwo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  parentName?: string;

  /** School portal enrollment: parent WhatsApp for weekly reports */
  @ApiPropertyOptional({ example: '+2348098765432' })
  @IsOptional()
  parentPhone?: string;

  /** School class UUID if enrolling into a school portal class */
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
