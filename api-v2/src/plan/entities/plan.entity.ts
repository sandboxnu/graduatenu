import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
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

  @Column({ type: 'smallint' })
  catalogYear: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
