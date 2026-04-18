import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentProfile } from './student-profile.entity';
import { DifficultyLevel } from 'src/common/enums/enums';

// For tracking topic mastery over time (historical data)
@Entity('topic_mastery_history')
@Index(['studentProfileId', 'subject', 'topic', 'recordedAt'])
export class TopicMasteryHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  studentProfileId!: string;

  @ManyToOne(() => StudentProfile)
  @JoinColumn({ name: 'student_profile_id' })
  studentProfile!: StudentProfile;

  @Column({ type: 'varchar', length: 100 })
  subject!: string;

  @Column({ type: 'varchar', length: 200 })
  topic!: string;

  @Column({ type: 'float' })
  masteryScore!: number; // 0-100

  @Column({ type: 'enum', enum: DifficultyLevel })
  level!: DifficultyLevel;

  @Column({ type: 'timestamp' })
  recordedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
