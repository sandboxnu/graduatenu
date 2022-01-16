import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import bcrypt from 'bcrypt';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  uuid: number;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'smallint', nullable: true })
  academicYear: number;

  @Column({ type: 'smallint', nullable: true })
  graduateYear: number;

  @Column({ type: 'smallint', nullable: true })
  catalogYear: number;

  @Column({ type: 'varchar', nullable: true })
  major: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
