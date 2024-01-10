import { Student } from "../../student/entities/student.entity";

/** Represents an authenticated request using the JwtAuthGuard. */
export interface AuthenticatedRequest extends Request {
  user: Student;
}
