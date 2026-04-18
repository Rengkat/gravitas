import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserDto,
  AdminUpdateUserDto,
  ChangePasswordDto,
  AdminResetPasswordDto,
} from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import {
  UserResponseDto,
  CreateUserResponseDto,
} from './dto/user-response.dto';
import {
  BulkCreateUsersDto,
  BulkCreateUsersResponseDto,
} from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // ══════════════════════════════════════════
  // SELF — authenticated user's own profile
  // ══════════════════════════════════════════

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiOkResponse({ type: UserResponseDto })
  getMe() {
    // TODO: replace 'temp-user-id' with @CurrentUser('id') when JWT is implemented
    return this.usersService.getProfile('temp-user-id');
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update my profile — name, phone, avatar, state, DOB, gender',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  updateMe(@Body() dto: UpdateUserDto) {
    // TODO: replace 'temp-user-id' with @CurrentUser('id') when JWT is implemented
    return this.usersService.updateProfile('temp-user-id', dto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change my password — requires current password' })
  @ApiOkResponse({
    schema: { example: { message: 'Password changed successfully' } },
  })
  @ApiBadRequestResponse({ description: 'Current password is incorrect' })
  changePassword(@Body() dto: ChangePasswordDto) {
    // TODO: replace 'temp-user-id' with @CurrentUser('id') when JWT is implemented
    return this.usersService.changePassword('temp-user-id', dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate my account — soft delete, cannot be undone by user',
  })
  @ApiOkResponse({
    schema: { example: { message: 'Account deactivated successfully' } },
  })
  deactivateMe() {
    // TODO: replace 'temp-user-id' with @CurrentUser('id') when JWT is implemented
    return this.usersService.deactivate('temp-user-id');
  }

  // ══════════════════════════════════════════
  // SUPER ADMIN ONLY
  // ══════════════════════════════════════════

  @Post()
  @ApiOperation({
    summary: '[Admin] Create a user directly',
    description:
      'Super admin creates any user type without OTP verification. ' +
      'If password is omitted, a secure temporary password is generated.',
  })
  @ApiCreatedResponse({ type: CreateUserResponseDto })
  @ApiConflictResponse({ description: 'Email already exists' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Admin] Bulk create up to 500 users in one request',
    description:
      'Processes in chunks of 50. Duplicates are skipped by default. ' +
      'Returns a detailed report with created/skipped/failed counts.',
  })
  @ApiOkResponse({ type: BulkCreateUsersResponseDto })
  bulkCreate(@Body() dto: BulkCreateUsersDto) {
    return this.usersService.bulkCreateUsers(dto);
  }

  @Get()
  @ApiOperation({
    summary: '[Admin] List all users with filters and pagination',
  })
  findAll(@Query() query: UserFilterDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get a user by ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      '[Admin] Update any user field including role and subscription tier',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.usersService.adminUpdateUser(id, dto);
  }

  @Post(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "[Admin] Reset a user's password",
    description:
      'If newPassword is omitted, a secure temp password is generated. ' +
      'If notifyUser is false, the temp password is returned in the response.',
  })
  adminResetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminResetPasswordDto,
  ) {
    return this.usersService.adminResetPassword(id, dto);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Deactivate a user account' })
  adminDeactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Reactivate a previously deactivated user' })
  adminReactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.adminUpdateUser(id, { isActive: true });
  }
}
