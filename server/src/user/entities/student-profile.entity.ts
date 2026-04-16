import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
// import { SchoolClass } from './school-admin.entity';
import { ExamType } from 'src/common/enums';
import { WeakTopic } from './weak-topic.entity';
import { StudyStreak } from './study-streak.entity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  targetScore: number | null;

  @Column({ type: 'date', nullable: true })
  examDate: Date | null;

  @Column({
    type: 'enum',
    enum: ExamType,
    array: true,
    default: [],
  })
  examTargets: ExamType[];

  /** e.g. "UNILAG", "UI", "OAU" */
  @Column({ type: 'varchar', length: 200, nullable: true })
  targetUniversity: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  targetCourse: string | null;

  /** Total XP accumulated across all sessions */
  @Column({ type: 'int', default: 0 })
  totalXp: number;

  /** Current streak in days — updated by a cron job */
  @Column({ type: 'int', default: 0 })
  currentStreak: number;

  @Column({ type: 'int', default: 0 })
  longestStreak: number;

  @Column({ type: 'timestamptz', nullable: true })
  lastStudyDate: Date | null;

  /** State code e.g. "LA", "KN" for matching in-person tutors */
  @Column({ type: 'varchar', length: 10, nullable: true })
  stateCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lga: string | null;

  /** National leaderboard rank — cached by cron */
  @Column({ type: 'int', nullable: true })
  leaderboardRank: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /* ── Relations ── */
  @OneToOne(() => User, (u) => u.studentProfile)
  @JoinColumn()
  user: User;

  /** Null if self-study student (not enrolled in a school portal) */ later;
  //   @ManyToOne(() => School, (s) => s.students, { nullable: true })
  //   school: School | null;

  //   @ManyToOne(() => SchoolClass, (c) => c.students, { nullable: true })
  //   schoolClass: SchoolClass | null;

  @OneToMany(() => StudyStreak, (s) => s.studentProfile)
  streakHistory: StudyStreak[];

  @OneToMany(() => WeakTopic, (w) => w.studentProfile)
  weakTopics: WeakTopic[];
}
