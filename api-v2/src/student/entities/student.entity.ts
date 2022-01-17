import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

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

  // attached to the student object when the student is logs in
  accessToken: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
