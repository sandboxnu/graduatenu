import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { formatServiceCtx } from "../../src/utils";
import {
  DeleteResult,
  FindOneOptions,
  Repository,
  UpdateResult,
} from "typeorm";
import * as bcrypt from "bcrypt";
import {
  ChangePasswordDto,
  isStrongPassword,
  ResetPasswordDto,
  SignUpStudentDto,
  UpdateStudentDto,
} from "@graduate/common";
import { Student } from "./entities/student.entity";
import {
  EmailAlreadyExists,
  NewPasswordsDontMatch,
  WeakPassword,
  WrongPassword,
} from "./student.errors";

@Injectable()
export class StudentService {
  private readonly logger: Logger = new Logger();

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>
  ) {}

  async create(
    createStudentDto: SignUpStudentDto
  ): Promise<Student | EmailAlreadyExists | WeakPassword> {
    // make sure the user doesn't already exists
    const { email, firstName, lastName, password, passwordConfirm } =
      createStudentDto;
    const userInDb = await this.studentRepository.findOne({ where: { email } });
    if (userInDb) {
      this.logger.debug(
        { message: "User already exists in db", userInDb },
        StudentService.formatStudentServiceCtx("create")
      );
      return new EmailAlreadyExists();
    }

    if (password !== passwordConfirm) {
      return null;
    }

    if (!isStrongPassword(password)) {
      return new WeakPassword();
    }

    let fullName;
    if (firstName && lastName) {
      fullName = `${firstName} ${lastName}`;
    }

    const newStudent = this.studentRepository.create({
      fullName,
      email,
      password,
    });

    try {
      return this.studentRepository.save(newStudent);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find();
  }

  async findByUuid(uuid: string, isWithPlans = false): Promise<Student> {
    const findOptions: FindOneOptions<Student> = { where: { uuid } };

    if (isWithPlans) {
      findOptions.relations = ["plans"];
    }

    return this.findOne(findOptions);
  }

  async findByEmail(email: string, isWithPlans = false): Promise<Student> {
    const findOptions: FindOneOptions<Student> = { where: { email } };

    if (isWithPlans) {
      findOptions.relations = ["plans"];
    }

    return this.findOne(findOptions);
  }

  private async findOne(
    findOptions: FindOneOptions<Student>
  ): Promise<Student> {
    const student = await this.studentRepository.findOne(findOptions);

    if (!student) {
      this.logger.debug(
        { message: "User doesn't exist in db", findOptions },
        StudentService.formatStudentServiceCtx("findOne")
      );
      return null;
    }

    return student;
  }

  async update(
    uuid: string,
    updateStudentDto: UpdateStudentDto
  ): Promise<UpdateResult> {
    const student = await this.findByUuid(uuid);
    const updatedStudent = { ...updateStudentDto, password: student.password };
    const updateResult = await this.studentRepository.update(
      uuid,
      updatedStudent
    );

    if (updateResult.affected === 0) {
      this.logger.debug(
        { message: "User doesn't exist in db", uuid },
        StudentService.formatStudentServiceCtx("update")
      );
      return null;
    }

    return updateResult;
  }

  async remove(uuid: string): Promise<DeleteResult> {
    const deleteResult = await this.studentRepository.delete(uuid);

    if (deleteResult.affected === 0) {
      this.logger.debug(
        { message: "User doesn't exist in db", uuid },
        StudentService.formatStudentServiceCtx("delete")
      );
      return null;
    }

    return deleteResult;
  }

  public async markEmailAsConfirmed(email: string): Promise<UpdateResult> {
    return this.studentRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      }
    );
  }

  static isEqualStudents(student1: Student, student2: Student): boolean {
    return student1.uuid === student2.uuid;
  }

  private static formatStudentServiceCtx(methodName: string) {
    return formatServiceCtx(StudentService.name, methodName);
  }

  async changePassword(
    uuid: any,
    changePasswordDto: ChangePasswordDto
  ): Promise<void | WeakPassword | WrongPassword> {
    const { currentPassword, newPassword, newPasswordConfirm } =
      changePasswordDto;
    const student = await this.findByUuid(uuid);

    if (newPassword !== newPasswordConfirm) {
      return new NewPasswordsDontMatch();
    }

    const { password: trueHashedPassword } = student;
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      trueHashedPassword
    );

    if (!isValidPassword) {
      this.logger.debug({
        message: "Invalid password",
        oldPassword: currentPassword,
      });
      return new WrongPassword();
    }

    if (!isStrongPassword(newPassword)) {
      this.logger.debug({
        message: "weak password",
        oldPassword: currentPassword,
      });
      return new WeakPassword();
    }
    await this.studentRepository.save(
      Object.assign(student, { password: newPassword })
    );
  }

  async resetPassword(
    email,
    resetPasswordData: ResetPasswordDto
  ): Promise<Student | Error> {
    const { password, passwordConfirm } = resetPasswordData;

    const student = await this.findByEmail(email);

    if (password !== passwordConfirm) {
      return new NewPasswordsDontMatch();
    }

    if (!isStrongPassword(password)) {
      this.logger.debug({ message: "weak password", password });
      return new WeakPassword();
    }

    return await this.studentRepository.save(
      Object.assign(student, { password })
    );
  }
}
