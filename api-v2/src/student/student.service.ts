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
      throw new HttpException(
        'A user with the email is already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newStudent = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(newStudent);
  }

  findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  findOne(uuid: string): Promise<Student> {
    return this.studentRepository.findOne(uuid);
  }

  async findByLoginCreds({ email }: LoginStudentDto): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { email } });

    if (!student) {
      throw new HttpException(
        'Student with the given email id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return student;
  }

  update(
    uuid: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<UpdateResult> {
    return this.studentRepository.update(uuid, updateStudentDto);
  }

  remove(uuid: string): Promise<DeleteResult> {
    return this.studentRepository.delete(uuid);
  }
}
