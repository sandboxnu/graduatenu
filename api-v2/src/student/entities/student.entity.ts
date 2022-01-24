import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ScheduleCourse } from '../../../../common/types';
import { Plan } from '../../plan/entities/plan.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: true })
  nuid: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // excludes this whenever an instance of Student is returned by a controller
  password: string;

  @Column({ type: 'smallint', nullable: true })
  academicYear: number;

  @Column({ type: 'smallint', nullable: true })
  graduateYear: number;

  @Column({ type: 'smallint', nullable: true })
  catalogYear: number;

  @Column({ nullable: true })
  major: string;

  @Column({ nullable: true })
  coopCycle: string;

  @Column({ type: 'json', nullable: true })
  coursesCompleted: ScheduleCourse[];

  @Column({ type: 'json', nullable: true })
  coursesTransfered: ScheduleCourse[];

  @Column({ nullable: true })
  primaryPlanId: number;

  @OneToMany(
    () => Plan,
    plan => plan.student,
    { cascade: true },
  )
  plans: Plan[];

  @Column({ nullable: true })
  concentration: string;

  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'NOW()' })
  updatedAt: Date;

  // attached to the student object when the student logs in
  accessToken?: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
