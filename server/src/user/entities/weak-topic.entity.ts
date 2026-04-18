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
import { DifficultyLevel, WeakTopicStatus } from 'src/common/enums/enums';

@Entity('weak_topics')
@Index(['studentProfileId', 'subject', 'topic'])
@Index(['studentProfileId', 'status'])
export class WeakTopic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  studentProfileId!: string;

  @ManyToOne(() => StudentProfile, (profile) => profile.weakTopics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_profile_id' })
  studentProfile!: StudentProfile;

  // Topic identification
  @Column({ type: 'varchar', length: 100 })
  subject!: string;

  @Column({ type: 'varchar', length: 200 })
  topic!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  subTopic?: string | null;

  // Performance metrics
  @Column({ type: 'float', default: 0 })
  averageScore!: number; // 0-100

  @Column({ type: 'float', default: 0 })
  lowestScore!: number;

  @Column({ type: 'float', default: 0 })
  highestScore!: number;

  @Column({ type: 'float', default: 0 })
  recentScore!: number; // Last 3 attempts average

  @Column({ type: 'int', default: 0 })
  timesPracticed!: number;

  @Column({ type: 'int', default: 0 })
  questionsAttempted!: number;

  @Column({ type: 'int', default: 0 })
  questionsCorrect!: number;

  // Difficulty tracking
  @Column({ type: 'enum', enum: DifficultyLevel, nullable: true })
  perceivedDifficulty?: DifficultyLevel;

  @Column({ type: 'float', nullable: true })
  confidenceLevel?: number; // 0-100 (self-assessed)

  // Time tracking
  @Column({ type: 'int', default: 0 })
  totalMinutesSpent!: number;

  @Column({ type: 'timestamp', nullable: true })
  lastPracticedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  firstIdentifiedAt!: Date;

  // Status and progress
  @Column({
    type: 'enum',
    enum: WeakTopicStatus,
    default: WeakTopicStatus.ACTIVE,
  })
  status!: WeakTopicStatus;

  @Column({ type: 'float', default: 0 })
  improvementRate!: number; // Percentage improvement over time

  @Column({ type: 'jsonb', nullable: true })
  recommendedResources?: {
    videos?: string[];
    exercises?: string[];
    articles?: string[];
  };

  // Metadata for analytics
  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    examTypes?: string[]; // JAMB, WAEC, etc.
    questionTypes?: string[]; // MCQ, Theory, etc.
    tags?: string[];
    notes?: string;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
