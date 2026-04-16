import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { StudentProfile } from './student-profile.entity';

export enum StreakStatus {
  ACTIVE = 'active',
  BROKEN = 'broken',
  ACHIEVED = 'achieved', // For milestone achievements (e.g., 7-day, 30-day)
}

@Entity('study_streaks')
@Index(['studentProfileId', 'date'])
export class StudyStreak {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  studentProfileId!: string;

  @ManyToOne(() => StudentProfile, (profile) => profile.streakHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_profile_id' })
  studentProfile!: StudentProfile;

  // Streak tracking
  @Column({ type: 'int', default: 1 })
  currentStreak!: number;

  @Column({ type: 'int', default: 0 })
  longestStreak!: number;

  @Column({ type: 'enum', enum: StreakStatus, default: StreakStatus.ACTIVE })
  status!: StreakStatus;

  // Date tracking
  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  lastStudyDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date | null;

  // Study session details
  @Column({ type: 'int', default: 0 })
  totalMinutesStudied!: number;

  @Column({ type: 'int', default: 0 })
  questionsAnswered!: number;

  @Column({ type: 'float', default: 0 })
  averageScore!: number;

  // Milestone tracking
  @Column({ type: 'jsonb', nullable: true })
  milestones?: {
    day3?: Date;
    day7?: Date;
    day14?: Date;
    day30?: Date;
    day100?: Date;
    [key: string]: Date | undefined;
  };

  // Metadata
  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    subjectsStudied?: string[];
    topicsCovered?: string[];
    devices?: string[];
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

// For tracking daily study activity (more granular)
@Entity('study_activities')
@Index(['studentProfileId', 'date'])
export class StudyActivity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  studentProfileId!: string;

  @ManyToOne(() => StudentProfile)
  @JoinColumn({ name: 'student_profile_id' })
  studentProfile!: StudentProfile;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'int', default: 0 })
  minutesStudied!: number;

  @Column({ type: 'int', default: 0 })
  questionsAttempted!: number;

  @Column({ type: 'int', default: 0 })
  questionsCorrect!: number;

  @Column({ type: 'float', default: 0 })
  sessionScore!: number;

  @Column({ type: 'jsonb', nullable: true })
  subjects?: { subject: string; minutes: number }[];

  @Column({ type: 'boolean', default: false })
  isStreakDay!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
