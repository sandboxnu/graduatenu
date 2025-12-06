import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { formatServiceCtx } from "../utils";
import { PlanService } from "../plan/plan.service";
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
  ScheduleTerm2,
  ScheduleYear2,
  SeasonEnum,
  SignUpStudentDto,
  UpdateStudentDto,
} from "@graduate/common";
import { Student } from "./entities/student.entity";
import {
  EmailAlreadyExists,
  MustUseHuskyEmail,
  NewPasswordsDontMatch,
  WeakPassword,
  WrongPassword,
} from "./student.errors";

@Injectable()
export class StudentService {
  private readonly logger: Logger = new Logger();

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private planService: PlanService
  ) {}

  async create(
    createStudentDto: SignUpStudentDto
  ): Promise<Student | EmailAlreadyExists | MustUseHuskyEmail | WeakPassword> {
    // make sure the user doesn't already exists
    const { email, fullName, password, passwordConfirm } = createStudentDto;
    const userInDb = await this.studentRepository.findOne({ where: { email } });
    if (userInDb) {
      this.logger.debug(
        { message: "User already exists in db", userInDb },
        StudentService.formatStudentServiceCtx("create")
      );
      return new EmailAlreadyExists();
    }

    if (!email.endsWith("@husky.neu.edu")) {
      return new MustUseHuskyEmail();
    }

    if (password !== passwordConfirm) {
      return null;
    }

    if (!isStrongPassword(password)) {
      return new WeakPassword();
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

    if (updateStudentDto.starredPlan) {
      if (
        !(await this.planService.isPlanOwnedByStudent(
          updateStudentDto.starredPlan,
          student
        ))
      ) {
        throw new ForbiddenException("Not authorized to star this plan.");
      }
    }

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

  async getStudentInterest(
    season: SeasonEnum,
    major?: string,
    subject?: string,
    classId?: string
  ): Promise<{ count: number; students: string[] }> {
    const students = await this.studentRepository.find({
      relations: ["plans"],
    });

    let count = 0;
    const studentsWithInterest: string[] = [];

    for (const student of students) {
      // if major param, skip if doesn't match
      if (major && student.major !== major) {
        continue;
      }

      const starredPlan = student.plans?.find(
        (p) => p.id === student.starredPlan
      );

      if (!starredPlan || !starredPlan.schedule?.years) {
        continue;
      }

      const years: ScheduleYear2<null>[] = starredPlan.schedule.years;
      let hasMatch = false;

      for (const year of years) {
        let termsToCheck: ScheduleTerm2<null>[] = [];

        switch (season) {
          case SeasonEnum.FL:
            termsToCheck = [year.fall];
            break;
          case SeasonEnum.SP:
            termsToCheck = [year.spring];
            break;
          case SeasonEnum.S1:
            termsToCheck = [year.summer1];
            break;
          case SeasonEnum.S2:
            termsToCheck = [year.summer2];
            break;
          case SeasonEnum.SM:
            termsToCheck = [year.summer1, year.summer2];
            break;
        }

        for (const term of termsToCheck) {
          if (!term || !term.classes || term.classes.length === 0) {
            continue;
          }

          // if no subject/classId params, any course in this term counts
          if (!subject && !classId) {
            hasMatch = true;
            break;
          }

          // if subject/classId, apply course filters
          const hasClass = term.classes.some((c) => {
            if (subject && c.subject !== subject) return false;
            if (classId && String(c.classId) !== String(classId)) return false;
            return true;
          });

          if (hasClass) {
            hasMatch = true;
            break;
          }
        }

        if (hasMatch) {
          break;
        }
      }

      if (hasMatch) {
        count++;
        studentsWithInterest.push(student.email);
      }
    }

    return { count, students: studentsWithInterest };
  }
}
