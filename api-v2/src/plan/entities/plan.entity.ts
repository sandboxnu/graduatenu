import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseWarning, IWarning } from '../../../../frontend/src/models/types';
import { Schedule } from '../../../../common/types';
import { Student } from '../../student/entities/student.entity';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(
    () => Student,
    student => student.plans,
  )
  student: Student;

  @Column({ type: 'json' })
  schedule: Schedule;

  @Column()
  major: string;

  @Column()
  coopCycle: string;

  @Column({ nullable: true })
  concentration: string;

  @Column({ type: 'smallint', default: 2018 })
  catalogYear: number;

  @Column({ type: 'json' })
  courseWarnings: CourseWarning[];

  @Column({ type: 'json' })
  warnings: IWarning[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
