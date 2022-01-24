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
  UseGuards,
  Req,
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Student } from './entities/student.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DevRouteGuard } from 'src/guards/dev-routes.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(
    @Req() req: AuthenticatedRequest,
    @Query('isWithPlans', new DefaultValuePipe(false), ParseBoolPipe)
    isWithPlans: boolean,
  ): Promise<Student> {
    try {
      const uuid = req.user.uuid;
      return await this.studentService.findByUuid(uuid, isWithPlans);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<UpdateResult> {
    const uuid = req.user.uuid;
    try {
      return await this.studentService.update(uuid, updateStudentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  async removeMe(@Req() req: AuthenticatedRequest): Promise<DeleteResult> {
    try {
      const uuid = req.user.uuid;
      return await this.studentService.remove(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // The following routes are only available in development
  @UseGuards(DevRouteGuard)
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      console.log('In handler');
      return await this.studentService.create(createStudentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(DevRouteGuard)
  @Get()
  findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  @UseGuards(DevRouteGuard)
  @Get(':uuid')
  async findOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<Student> {
    try {
      return await this.studentService.findByUuid(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(DevRouteGuard)
  @Patch(':uuid')
  async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<UpdateResult> {
    try {
      return await this.studentService.update(uuid, updateStudentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(DevRouteGuard)
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
