import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  IsUrl,
  IsEnum,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
  MinLength,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { NigerianState, SessionType } from 'src/common/enums/enums';
import { CreateUserDto } from './create-user.dto';
import { UserResponseDto } from './user-response.dto';

// ─────────────────────────────────────────────
// TUTOR AVAILABILITY SLOT DTO
// Nested inside CreateTutorDto / UpdateTutorDto
// ─────────────────────────────────────────────
export class AvailabilitySlotDto {
  @ApiProperty({ example: 1, description: '0=Monday … 6=Sunday' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty({ example: '09:00', description: 'HH:mm (24hr format)' })
  @IsString()
  startTime!: string;

  @ApiProperty({ example: '17:00', description: 'HH:mm (24hr format)' })
  @IsString()
  endTime!: string;
}

// ─────────────────────────────────────────────
// TUTOR BANK DETAILS DTO
// Stored for Paystack payouts. Never returned in public API responses.
// ─────────────────────────────────────────────
export class BankDetailsDto {
  @ApiProperty({ example: 'Access Bank' })
  @IsString()
  @IsNotEmpty()
  bankName!: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  accountNumber!: string;

  @ApiProperty({ example: 'Adaeze Okonkwo' })
  @IsString()
  @IsNotEmpty()
  accountName!: string;

  /** Paystack bank code e.g. "044" for Access Bank */
  @ApiProperty({ example: '044' })
  @IsString()
  @IsNotEmpty()
  bankCode!: string;
}

// ─────────────────────────────────────────────
// EDUCATION DTO
// ─────────────────────────────────────────────
export class EducationDto {
  @ApiProperty({ example: 'University of Lagos' })
  @IsString()
  @IsNotEmpty()
  institution!: string;

  @ApiProperty({ example: 'B.Sc Physics' })
  @IsString()
  @IsNotEmpty()
  degree!: string;

  @ApiProperty({ example: '2018' })
  @IsString()
  graduationYear!: string;
}

// ─────────────────────────────────────────────
// CREATE TUTOR DTO
// Who calls it:
//   1. User applies as tutor via POST /tutors/apply
//   2. Super Admin creates tutor directly via POST /users (with role=TUTOR)
//
// The tutor profile is created in a separate TutorProfile entity,
// but these fields are collected at registration.
// ─────────────────────────────────────────────
export class CreateTutorDto extends CreateUserDto {
  @ApiProperty({
    example: 'Mr.',
    description: 'Title/prefix: Mr, Mrs, Dr, Prof',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title!: string;

  @ApiProperty({
    example: 'Experienced Physics and Mathematics teacher with 6 years...',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(100, {
    message: 'Bio must be at least 100 characters — be detailed!',
  })
  @MaxLength(2000)
  bio!: string;

  /**
   * Subjects the tutor teaches. Uses subject slugs.
   * e.g. ['physics', 'mathematics', 'further-mathematics']
   */
  @ApiProperty({
    type: [String],
    example: ['physics', 'mathematics'],
    description: 'At least one subject required',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one subject is required' })
  @IsString({ each: true })
  specialization!: string[];

  @ApiProperty({ example: 6, description: 'Years of teaching experience' })
  @IsInt()
  @Min(0)
  @Max(50)
  experience!: number;

  @ApiProperty({
    type: [String],
    example: ['B.Sc Physics (UNILAG)', 'PGDE (UI)', 'JAMB Certified Marker'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  qualifications!: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['WAEC Question Setter', 'Google Certified Educator'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  /**
   * Hourly rate in full Naira (not kobo).
   * Stored as kobo in the database: this value × 100.
   * Minimum ₦500/hr, Maximum ₦50,000/hr
   */
  @ApiProperty({
    example: 5000,
    description: 'Hourly rate in Naira (₦500 – ₦50,000)',
  })
  @IsInt()
  @Min(500, { message: 'Minimum hourly rate is ₦500' })
  @Max(50000, { message: 'Maximum hourly rate is ₦50,000' })
  hourlyRate!: number;

  @ApiProperty({
    type: [String],
    example: ['English', 'Yoruba'],
    description: 'Languages the tutor can teach in',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  languages!: string[];

  @ApiPropertyOptional({ enum: SessionType, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(SessionType, { each: true })
  sessionTypes?: SessionType[];

  @ApiPropertyOptional({ type: [AvailabilitySlotDto] })
  @IsOptional()
  @IsArray()
  @Type(() => AvailabilitySlotDto)
  availability?: AvailabilitySlotDto[];

  @ApiPropertyOptional({ type: [EducationDto] })
  @IsOptional()
  @IsArray()
  @Type(() => EducationDto)
  education?: EducationDto[];

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/gravitas/video/intro.mp4',
    description: 'Short intro video URL (max 2 minutes)',
  })
  @IsOptional()
  @IsUrl()
  videoIntro?: string;

  @ApiPropertyOptional({ enum: NigerianState })
  @IsOptional()
  @IsEnum(NigerianState)
  state?: NigerianState;

  @ApiPropertyOptional({ example: 'Surulere' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  teachingLga?: string;

  @ApiPropertyOptional({
    description: 'Can teach students online via Livekit',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  canTeachOnline?: boolean = true;

  @ApiPropertyOptional({
    description: 'Can go to student location in-person',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  canTeachInPerson?: boolean = false;
}

// ─────────────────────────────────────────────
// UPDATE TUTOR DTO
// Tutor updates their own profile via PATCH /tutors/my-profile
// ─────────────────────────────────────────────
export class UpdateTutorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(100)
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialization?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(500)
  @Max(50000)
  hourlyRate?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ type: [AvailabilitySlotDto] })
  @IsOptional()
  @IsArray()
  @Type(() => AvailabilitySlotDto)
  availability?: AvailabilitySlotDto[];

  @ApiPropertyOptional({ type: [EducationDto] })
  @IsOptional()
  @IsArray()
  @Type(() => EducationDto)
  education?: EducationDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  videoIntro?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canTeachOnline?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canTeachInPerson?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;
}

// ─────────────────────────────────────────────
// TUTOR RESPONSE DTO
// What the public API returns for tutors.
// Intentionally excludes bankDetails — that's admin-only.
// ─────────────────────────────────────────────
export class TutorResponseDto extends UserResponseDto {
  @Expose()
  @ApiProperty({ example: 'Dr.' })
  title!: string;

  @Expose()
  @ApiProperty()
  bio!: string;

  @Expose()
  @ApiProperty({ type: [String] })
  specialization!: string[];

  @Expose()
  @ApiProperty({ example: 6 })
  experience!: number;

  @Expose()
  @ApiProperty({ type: [String] })
  qualifications!: string[];

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  certifications?: string[];

  /** Hourly rate in full Naira (divided from kobo storage) */
  @Expose()
  @ApiProperty({ example: 5000 })
  hourlyRate!: number;

  @Expose()
  @ApiProperty({ example: 4.8, description: 'Average rating out of 5' })
  rating!: number;

  @Expose()
  @ApiProperty({ example: 127 })
  totalReviews!: number;

  @Expose()
  @ApiProperty({ example: 89 })
  totalStudents!: number;

  @Expose()
  @ApiProperty({ example: 342 })
  totalSessions!: number;

  @Expose()
  @ApiProperty({ example: 96.2, description: 'Session completion rate %' })
  completionRate!: number;

  @Expose()
  @ApiProperty({ example: false })
  isOnline!: boolean;

  @Expose()
  @ApiProperty({ example: true })
  isVerified!: boolean;

  @Expose()
  @ApiProperty({ example: false })
  isFeatured!: boolean;

  @Expose()
  @ApiProperty({ type: [String] })
  languages!: string[];

  @Expose()
  @ApiPropertyOptional({ type: [AvailabilitySlotDto] })
  availability?: AvailabilitySlotDto[];

  @Expose()
  @ApiPropertyOptional({ type: [EducationDto] })
  education?: EducationDto[];

  @Expose()
  @ApiPropertyOptional()
  videoIntro?: string;

  @Expose()
  @ApiProperty({ example: true })
  canTeachOnline!: boolean;

  @Expose()
  @ApiProperty({ example: false })
  canTeachInPerson!: boolean;

  // bankDetails is intentionally NOT exposed here — admin only
}
