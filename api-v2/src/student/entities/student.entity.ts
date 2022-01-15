import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  uuid: number;

  @Column()
  fullName: string;

  @Column()
  academicYear: number;

  @Column()
  graduateYear: number;

  @Column()
  catalogYear: number;

  @Column()
  major: string;
}
