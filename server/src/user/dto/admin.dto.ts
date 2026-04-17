import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NigerianState, Subject } from 'src/common/enums';
import { CreateUserDto } from './create-user.dto';
import { UserResponseDto } from './user-response.dto';

// ─────────────────────────────────────────────
// CREATE SCHOOL ADMIN DTO
// Who calls it: Super Admin creates a school admin
//   via POST /users (role = SCHOOL_ADMIN)
//   OR via POST /school (creates school + admin together)
//
// A SCHOOL_ADMIN manages a school portal:
//   - creates/publishes CBT tests
//   - manages student enrollments
//   - views school-wide reports
//   - configures WhatsApp reports
// ─────────────────────────────────────────────
export class CreateSchoolAdminDto extends CreateUserDto {
  /**
   * The school this admin manages.
   * If provided, the admin is linked to the school immediately.
   * If omitted, admin must set up their school via POST /school.
   */
  @ApiPropertyOptional({ example: 'uuid-of-school-entity' })
  @IsOptional()
  @IsUUID('4')
  schoolId?: string;

  /**
   * School name — only used when creating the school and admin
   * in a single request (POST /school creates both).
   */
  @ApiPropertyOptional({ example: 'Kings College Lagos' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  schoolName?: string;

  @ApiPropertyOptional({
    example: 'kings-college-lagos',
    description: 'Subdomain for school portal',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Subdomain: only lowercase letters, numbers, hyphens',
  })
  subdomain?: string;

  @ApiPropertyOptional({ example: 'Eti-Osa' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  schoolLga?: string;

  @ApiPropertyOptional({ enum: NigerianState })
  @IsOptional()
  @IsEnum(NigerianState)
  schoolState?: NigerianState;
}

// ─────────────────────────────────────────────
// CREATE CLASS ADMIN DTO
// Who calls it: SCHOOL_ADMIN creates a class admin
//   via POST /school/class-admins
//
// A CLASS_ADMIN is typically a teacher who manages one or more classes:
//   - creates tests for their classes
//   - views their class students' performance
//   - cannot see other classes in the school
// ─────────────────────────────────────────────
export class CreateClassAdminDto extends CreateUserDto {
  /** School the class admin belongs to */
  @ApiProperty({ example: 'uuid-of-school-entity' })
  @IsUUID('4')
  schoolId!: string;

  /**
   * Which class(es) this teacher/admin manages.
   * A teacher can manage multiple classes.
   */
  @ApiPropertyOptional({
    type: [String],
    example: ['uuid-of-ss2a', 'uuid-of-ss2b'],
    description: 'Class UUIDs this admin manages',
  })
  @IsOptional()
  classIds?: string[];

  /** Subject(s) this teacher teaches — for assignment filtering */
  @ApiPropertyOptional({
    type: [String],
    example: ['physics', 'mathematics'],
  })
  @IsOptional()
  subjects?: Subject[];
}

// ─────────────────────────────────────────────
// CREATE SUPER ADMIN DTO
// Who calls it: Only an existing SUPER_ADMIN
//   via POST /admin/admins
//
// SUPER_ADMIN has unrestricted access to everything.
// There should be very few of these — guard this endpoint tightly.
// ─────────────────────────────────────────────
export class CreateSuperAdminDto extends CreateUserDto {
  /**
   * Internal Gravitas team designation.
   * e.g. 'CTO', 'Content Manager', 'Support Lead'
   */
  @ApiPropertyOptional({ example: 'Content Manager' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  designation?: string;

  /**
   * Access level within super admins (for audit purposes only).
   * Does not affect permissions — all super admins have full access.
   * 'full' | 'readonly' | 'support'
   */
  @ApiPropertyOptional({
    example: 'support',
    description: 'Audit label only — does not restrict permissions',
  })
  @IsOptional()
  @IsString()
  accessLevel?: 'full' | 'readonly' | 'support';
}

// ─────────────────────────────────────────────
// SCHOOL ADMIN RESPONSE DTO
// ─────────────────────────────────────────────
export class SchoolAdminResponseDto extends UserResponseDto {
  @Expose()
  @ApiPropertyOptional({ example: 'uuid-of-school' })
  schoolId?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Kings College Lagos' })
  schoolName?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'kings-college-lagos.gravitas.ng' })
  portalUrl?: string;

  @Expose()
  @ApiProperty({ example: 342, description: 'Total students in this school' })
  totalStudents!: number;

  @Expose()
  @ApiProperty({ example: 18, description: 'Total tests created' })
  totalTests!: number;
}

// ─────────────────────────────────────────────
// CLASS ADMIN RESPONSE DTO
// ─────────────────────────────────────────────
export class ClassAdminResponseDto extends UserResponseDto {
  @Expose()
  @ApiPropertyOptional({ example: 'uuid-of-school' })
  schoolId?: string;

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  classIds?: string[];

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  subjects?: Subject[];
}

// ─────────────────────────────────────────────
// SUPER ADMIN RESPONSE DTO
// ─────────────────────────────────────────────
export class SuperAdminResponseDto extends UserResponseDto {
  @Expose()
  @ApiPropertyOptional({ example: 'Content Manager' })
  designation?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'full' })
  accessLevel?: string;
}
