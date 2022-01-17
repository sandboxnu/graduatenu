import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginStudentDto } from 'src/auth/dto/login-student.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  create(createStudentDto: CreateStudentDto): Promise<Student> {
    // make sure the user doesn't already exists
    const { email } = createStudentDto;
    const userInDb = this.studentRepository.findOne({ where: { email } });
    if (userInDb) {
      throw new Error('A user with the email is already registered');
    }

    const newStudent = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(newStudent);
  }

  findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findOne(uuid: string): Promise<Student> {
    const student = await this.studentRepository.findOne(uuid);
    if (!student) {
      throw new Error('Student with given id is not found');
    }

    return student;
  }

  async findByEmail(email: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { email },
    });
    if (!student) {
      throw new Error('Student with given id is not found');
    }

    return student;
  }

  update(
    uuid: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<UpdateResult> {
    return this.studentRepository.update(uuid, updateStudentDto);
  }

  async remove(uuid: string): Promise<DeleteResult> {
    const deleteResult = await this.studentRepository.delete(uuid);
    if (deleteResult.affected === 0) {
      throw new Error('Student with given id is not found');
    }

    return deleteResult;
  }
}
