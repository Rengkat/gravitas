import { AdminRole } from 'src/common/enums/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  // ManyToOne,
  // OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('school_admins')
export class SchoolAdmin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AdminRole, default: AdminRole.TEACHER })
  adminRole: AdminRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /* ── Relations ── later;*/
  @OneToOne(() => User, (u) => u.schoolAdmin)
  @JoinColumn()
  user: User;

  //   @ManyToOne(() => School, (s) => s.admins)
  //   school: School;
}
