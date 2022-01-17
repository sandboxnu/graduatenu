import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Student } from './entities/student.entity';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      return await this.studentService.create(createStudentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  @Get(':uuid')
  async findOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<Student> {
    try {
      return await this.studentService.findOne(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<UpdateResult> {
    return this.studentService.update(uuid, updateStudentDto);
  }

  @Delete(':uuid')
  async remove(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<DeleteResult> {
    try {
      return await this.studentService.remove(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
