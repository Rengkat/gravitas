import { SessionMode, TutorStatus } from 'src/common/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  // OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('tutor_profiles')
export class TutorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  /** e.g. ["mathematics","physics","chemistry"] */
  @Column({ type: 'varchar', array: true, default: [] })
  subjects: string[];

  /** Hourly rate in kobo (multiply × 100 from Naira) */
  @Column({ type: 'int', default: 0 })
  hourlyRateKobo: number;

  @Column({ type: 'enum', enum: SessionMode, default: SessionMode.ONLINE })
  sessionMode: SessionMode;

  @Column({ type: 'enum', enum: TutorStatus, default: TutorStatus.PENDING })
  status: TutorStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'int', default: 0 })
  totalSessionsCompleted: number;

  /** Verified qualifications (degree, WAEC cert, etc.) */
  @Column({ type: 'jsonb', default: [] })
  qualifications: { title: string; institution: string; year: number }[];

  /** Escrow balance in kobo — released after session completion */
  @Column({ type: 'int', default: 0 })
  escrowBalanceKobo: number;

  /** Total lifetime earnings in kobo */
  @Column({ type: 'int', default: 0 })
  totalEarnedKobo: number;

  /** Bank account details for payouts */
  @Column({ type: 'jsonb', nullable: true })
  bankDetails: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  } | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /* ── Relations ── */
  @OneToOne(() => User, (u) => u.tutorProfile)
  @JoinColumn()
  user: User;

  //WILL ADD THIS LATER
  //   @OneToMany(() => TutorSession, (s) => s.tutor)
  //   sessions: TutorSession[];

  //   @OneToMany(() => TutorReview, (r) => r.tutor)
  //   reviews: TutorReview[];

  //   @OneToMany(() => TutorAvailability, (a) => a.tutor)
  //   availability: TutorAvailability[];

  //   @OneToMany(() => Payout, (p) => p.tutor)
  //   payouts: Payout[];
}
