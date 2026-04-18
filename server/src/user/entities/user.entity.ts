import { AuthProvider, UserRole } from 'src/common/enums';
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

  @Column({ type: 'varchar', nullable: false, select: false })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  /** State for matching in-person tutors */
  @Column({ type: 'varchar', length: 10, nullable: true })
  stateOfResidence: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lga: string | null;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.EMAIL })
  authProvider!: AuthProvider;

  @Column({ type: 'varchar', nullable: true })
  googleId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string | null;

  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  isPhoneVerified?: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ type: 'varchar', nullable: true, select: false })
  twoFactorSecret?: string | null;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled?: boolean;

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
