/**
 * Gravitas — Users DTO Barrel Export
 *
 * Import from here instead of individual files:
 *   import { CreateStudentDto, TutorResponseDto } from './dto';
 */

// ── Base ─────────────────────────────────────
export { BaseUserDto } from './base-user.dto';

// ── Create ───────────────────────────────────
export {
  CreateUserDto,
  BulkCreateUserRowDto,
  BulkCreateUsersDto,
  BulkCreateUsersResponseDto,
} from './create-user.dto';

// ── Update ───────────────────────────────────
export {
  UpdateUserDto,
  AdminUpdateUserDto,
  AdminResetPasswordDto,
  ChangePasswordDto,
} from './update-user.dto';

// ── Response shapes ──────────────────────────
export { UserResponseDto, UserSummaryDto } from './user-response.dto';

// ── Student ──────────────────────────────────
export {
  CreateStudentDto,
  UpdateStudentDto,
  StudentResponseDto,
} from './student.dto';

// ── Tutor ────────────────────────────────────
export {
  CreateTutorDto,
  UpdateTutorDto,
  TutorResponseDto,
  AvailabilitySlotDto,
  BankDetailsDto,
  EducationDto,
} from './tutor.dto';

// ── Admins ───────────────────────────────────
export {
  CreateSchoolAdminDto,
  CreateClassAdminDto,
  CreateSuperAdminDto,
  SchoolAdminResponseDto,
  ClassAdminResponseDto,
  SuperAdminResponseDto,
} from './admin.dto';

// ── Filters (query params) ───────────────────
export {
  UserFilterDto,
  StudentFilterDto,
  TutorFilterDto,
} from './user-filter.dto';
