import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Student } from "../../student/entities/student.entity";

@Entity()
export class PlanShare {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true, length: 5 })
  planCode: string;

  @Column({ type: "json" })
  planJson: any;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  // if a student ever decides to deactivate their code
  @Column({ type: "timestamp", nullable: true })
  revokedAt?: Date;

  @ManyToOne(() => Student, (student) => student.planShares, {
    onDelete: "CASCADE",
  })
  student: Student;
}
