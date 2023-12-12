import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Student } from "../../src/student/entities/student.entity";
import { StudentService } from "../../src/student/student.service";
import {
  LoginStudentDto,
  ResetPasswordDto,
  SignUpStudentDto,
} from "@graduate/common";
import { JwtPayload } from "./interfaces/jwt-payload";
import * as bcrypt from "bcrypt";
import { formatServiceCtx } from "../../src/utils";
import {
  EmailAlreadyExists,
  EmailNotConfirmed,
  NoSuchEmail,
  WeakPassword,
} from "../../src/student/student.errors";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../../src/environment-variables";
import EmailService from "../../src/email/email.service";
import { BadToken, InvalidPayload, TokenExpiredError } from "./auth.errors";
import { ALLOWED_HOSTS } from "src/constants";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger();

  constructor(
    // used to retrieve user from the db based on creds
    private readonly studentService: StudentService,

    // used to generate and sign a JWT
    private readonly jwtService: JwtService,

    // For env vars
    private readonly configService: ConfigService<EnvironmentVariables, true>,

    // For sending emails
    private readonly emailService: EmailService
  ) {}

  /** Registers a new student in the db and logs the student in. */
  async register(
    createStudentDto: SignUpStudentDto
  ): Promise<Student | EmailAlreadyExists | WeakPassword> {
    // create a new student
    const newStudent = await this.studentService.create(createStudentDto);

    if (
      newStudent instanceof EmailAlreadyExists ||
      newStudent instanceof WeakPassword
    ) {
      return newStudent;
    }

    if (!newStudent) {
      return null;
    }

    // login the new student by generating a new access token
    newStudent.accessToken = this._generateAccessToken(newStudent);

    return newStudent;
  }

  /** Validates the login creds and logs the student in if the creds are valid. */
  async login(loginStudentDto: LoginStudentDto): Promise<Student> {
    const { email, password } = loginStudentDto;

    // find student in db
    const student = await this.studentService.findByEmail(email);

    if (!student) {
      this.logger.debug(
        { message: "Unknown email", email },
        AuthService.formatAuthServiceCtx("login")
      );
      return null;
    }

    // validate creds
    const { password: trueHashedPassword } = student;
    const isValidPassword = await bcrypt.compare(password, trueHashedPassword);

    if (!isValidPassword) {
      this.logger.debug(
        { message: "Invalid password", email, password },
        AuthService.formatAuthServiceCtx("login")
      );
      return null;
    }

    // generate and sign token
    student.accessToken = this._generateAccessToken(student);

    return student;
  }

  async forgotPassword(email: string): Promise<Student | NoSuchEmail> {
    const student = await this.studentService.findByEmail(email);

    if (!student) {
      this.logger.debug(
        { message: "Unknown email", email },
        AuthService.formatAuthServiceCtx("forgotPassword")
      );
      return new NoSuchEmail();
    }

    if (!student.isEmailConfirmed) {
      this.logger.debug(
        { message: "Student has not confirmed email", email },
        AuthService.formatAuthServiceCtx("forgotPassword")
      );
      return new EmailNotConfirmed();
    }

    const payload = { email };
    const token = this.jwtService.sign(payload);
    const url = `${this.configService.get(
      "FORGOT_PASSWORD_URL"
    )}?token=${token}`;

    const text = `Click the following link to reset your password: ${url}.\n If you did not request this, we recommend changing your password as soon as possible`;

    return this.emailService.sendMail({
      to: email,
      subject: "GraduateNU - Reset Password",
      text,
    });
  }

  async decodeResetPassToken(token: string): Promise<string | Error> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get("JWT_SECRET_KEY"),
      });

      if (
        typeof payload === "object" &&
        "email" in payload &&
        typeof payload.email === "string"
      ) {
        return payload.email;
      }
      this.logger.debug({
        message: "Invalid payload",
        payload,
      });
      return new InvalidPayload();
    } catch (error) {
      if (error?.name === "TokenExpiredError") {
        this.logger.debug({
          message: "Rest Password token expired",
          error,
        });
        return new TokenExpiredError();
      }
      this.logger.debug({
        message: "Bad confirmation token",
      });
      return new BadToken();
    }
  }

  async resetPassword(
    email: string,
    resetPasswordData: ResetPasswordDto
  ): Promise<Student | WeakPassword> {
    return await this.studentService.resetPassword(email, resetPasswordData);
  }

  /**
   * Generates and signs a JWT that contain's the student's email and uuid.
   *
   * @param student The student for which the JWT is generated.
   */
  private _generateAccessToken({ email, uuid }: Student): string {
    const jwtPayload: JwtPayload = { email, uuid };
    return this.jwtService.sign(jwtPayload);
  }

  /**
   * Validate's the JWT payload by simply making sure the uuid in the payload is
   * valid and belongs to a student in the db.
   */
  async validateJwtPayload({ uuid }: JwtPayload): Promise<Student> {
    return await this.studentService.findByUuid(uuid);
  }

  private static formatAuthServiceCtx(methodName: string): string {
    return formatServiceCtx(AuthService.name, methodName);
  }

  static throwIfInvalidHostnameForCookie(hostname: string): void {
    if (!ALLOWED_HOSTS.has(hostname)) {
      throw new BadRequestException(
        "Graduate Auth: host not in list of allowed hosts (ALLOWED_HOSTS)."
      );
    }
  }
}
