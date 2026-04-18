import {
  AuthProvider,
  Gender,
  NigerianState,
  UserRole,
} from 'src/common/enums/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  // OneToMany,
  Index,
} from 'typeorm';
import { StudentProfile } from './student-profile.entity';
import { TutorProfile } from './tutor-profile.entity';
import { SchoolAdmin } from './school-admin.entity';
// import { Subscription } from './subscription.entity';
// import { Notification } from './notification.entity';
// import { AiChatSession } from './ai-chat-session.entity';
// import { ExamSession } from './exam-session.entity';

@Entity('users')
@Index(['email'], { unique: true, where: '"email" IS NOT NULL' })
@Index(['phoneNumber'], { unique: true, where: '"phone_number" IS NOT NULL' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'email',
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 20,
    nullable: true,
    name: 'phone_number',
  })
  phoneNumber?: string | null;

  // ── Auth ───────────────────────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: false, select: false })
  passwordHash!: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.EMAIL })
  authProvider!: AuthProvider;

  @Column({ type: 'varchar', nullable: true, select: false })
  googleId?: string | null;

  // ── OTP — email/phone verification & 2FA ──────────────────────────────
  @Column({ type: 'varchar', length: 6, nullable: true, select: false })
  otpCode: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  otpExpiresAt: Date | null;

  @Column({ type: 'int', default: 0 })
  otpAttempts: number; // brute-force protection — reset on new OTP

  // ── Email verification (link-based) ───────────────────────────────────
  @Column({ type: 'varchar', nullable: true, select: false })
  verificationToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  verificationTokenExpiresAt: Date | null;

  // ── Password reset ─────────────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: true, select: false })
  passwordResetToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpiresAt: Date | null;

  // ── Two-factor auth ────────────────────────────────────────────────────
  @Column({ type: 'varchar', nullable: true, select: false })
  twoFactorSecret?: string | null;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled?: boolean;

  // ── Role & status ──────────────────────────────────────────────────────
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  isPhoneVerified?: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // ── Profile ────────────────────────────────────────────────────────────
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @Column({ type: 'enum', enum: NigerianState, nullable: true })
  stateOfResidence: NigerianState | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lga: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  // ── Timestamps ─────────────────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  /* ── Relations ── */
  @OneToOne(() => StudentProfile, (p) => p.user, { nullable: true })
  studentProfile: StudentProfile | null;

  @OneToOne(() => TutorProfile, (p) => p.user, { nullable: true })
  tutorProfile: TutorProfile | null;

  @OneToOne(() => SchoolAdmin, (a) => a.user, { nullable: true })
  schoolAdmin: SchoolAdmin | null;

  //   @OneToMany(() => Subscription, (s) => s.user)
  //   subscriptions: Subscription[];

  //   @OneToMany(() => Notification, (n) => n.user)
  //   notifications: Notification[];

  //   @OneToMany(() => AiChatSession, (s) => s.user)
  //   aiChatSessions: AiChatSession[];

  //   @OneToMany(() => ExamSession, (s) => s.user)
  //   examSessions: ExamSession[];

  /* Computed */
  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
  }
}
