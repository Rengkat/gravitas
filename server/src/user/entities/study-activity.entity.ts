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

// or tracking daily study activity (more granular)
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
