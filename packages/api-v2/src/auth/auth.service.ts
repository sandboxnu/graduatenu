import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateStudentDto } from "src/student/dto/create-student.dto";
import { Student } from "src/student/entities/student.entity";
import { StudentService } from "src/student/student.service";
import { LoginStudentDto } from "./dto/login-student.dto";
import { JwtPayload } from "./interfaces/jwt-payload";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    // used to retrieve user from the db based on creds
    private readonly studentService: StudentService,

    // used to generate and sign a JWT
    private readonly jwtService: JwtService
  ) {}

  /**
   * Registers a new student in the db and logs the student in.
   */
  async register(createStudentDto: CreateStudentDto): Promise<Student> {
    // create a new student
    const newStudent = await this.studentService.create(createStudentDto);

    if (!newStudent) {
      return null;
    }

    // login the new student by generating a new access token
    newStudent.accessToken = this._generateAccessToken(newStudent);

    return newStudent;
  }

  /**
   * Validates the login creds and logs the student in if the creds are valid.
   * Else, throws an error.
   */
  async login(loginStudentDto: LoginStudentDto): Promise<Student> {
    const { email, password } = loginStudentDto;

    // find student in db
    const student = await this.studentService.findByEmail(email);

    if (!student) {
      return null;
    }

    // validate creds
    const { password: trueHashedPassword } = student;
    const isValidPassword = await bcrypt.compare(password, trueHashedPassword);

    if (!isValidPassword) {
      return null;
    }

    // generate and sign token
    student.accessToken = this._generateAccessToken(student);

    return student;
  }

  /**
   * Generates and signs a JWT that contain's the student's email and uuid.
   * @param student the student for which the JWT is generated.
   */
  private _generateAccessToken({ email, uuid }: Student): string {
    const jwtPayload: JwtPayload = { email, uuid };
    return this.jwtService.sign(jwtPayload);
  }

  /**
   * Validate's the JWT payload by simply making sure the uuid in the payload
   * is valid and belongs to a student in the db.
   */
  async validateJwtPayload({ uuid }: JwtPayload): Promise<Student> {
    return await this.studentService.findByUuid(uuid);
  }
}
