import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeleteResult,
  FindOneOptions,
  Repository,
  UpdateResult,
} from "typeorm";
import { CreateStudentDto, UpdateStudentDto } from "../../../common";
import { Student } from "./entities/student.entity";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // make sure the user doesn't already exists
    const { email } = createStudentDto;
    const userInDb = await this.studentRepository.findOne({ where: { email } });
    if (userInDb) {
      return null;
    }

    const newStudent = this.studentRepository.create(createStudentDto);

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
      return null;
    }

    return student;
  }

  async update(
    uuid: string,
    updateStudentDto: UpdateStudentDto
  ): Promise<UpdateResult> {
    const updateResult = await this.studentRepository.update(
      uuid,
      updateStudentDto
    );

    if (updateResult.affected === 0) {
      return null;
    }

    return updateResult;
  }

  async remove(uuid: string): Promise<DeleteResult> {
    const deleteResult = await this.studentRepository.delete(uuid);

    if (deleteResult.affected === 0) {
      return null;
    }

    return deleteResult;
  }

  static isEqualStudents(student1: Student, student2: Student): boolean {
    return student1.uuid === student2.uuid;
  }
}
