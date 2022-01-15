import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const newStudent = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(newStudent);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find();
  }

  findOne(uuid: string): Promise<Student> {
    return this.studentRepository.findOne(uuid);
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
