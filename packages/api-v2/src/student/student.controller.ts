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
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { DeleteResult, UpdateResult } from "typeorm";
import { Student } from "./entities/student.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { DevRouteGuard } from "src/guards/dev-route.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request";

@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(
    @Req() req: AuthenticatedRequest,
    @Query("isWithPlans", new DefaultValuePipe(false), ParseBoolPipe)
    isWithPlans: boolean
  ): Promise<Student> {
    const uuid = req.user.uuid;
    const student = await this.studentService.findByUuid(uuid, isWithPlans);

    if (!student) {
      throw new BadRequestException();
    }

    return student;
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() updateStudentDto: UpdateStudentDto
  ): Promise<UpdateResult> {
    const uuid = req.user.uuid;
    const updateResult = await this.studentService.update(
      uuid,
      updateStudentDto
    );

    if (!updateResult) {
      throw new BadRequestException();
    }

    return updateResult;
  }

  @UseGuards(JwtAuthGuard)
  @Delete("me")
  async removeMe(@Req() req: AuthenticatedRequest): Promise<DeleteResult> {
    const uuid = req.user.uuid;
    const deleteResult = await this.studentService.remove(uuid);

    if (!deleteResult) {
      throw new BadRequestException();
    }

    return deleteResult;
  }

  // The following routes are only available in development
  @UseGuards(DevRouteGuard)
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    const student = await this.studentService.create(createStudentDto);

    if (!student) {
      throw new BadRequestException();
    }

    return student;
  }

  @UseGuards(DevRouteGuard)
  @Get()
  async findAll(): Promise<Student[]> {
    const students = await this.studentService.findAll();

    if (!students) {
      throw new BadRequestException();
    }

    return students;
  }

  @UseGuards(DevRouteGuard)
  @Get(":uuid")
  async findOne(
    @Param("uuid", new ParseUUIDPipe()) uuid: string
  ): Promise<Student> {
    const student = await this.studentService.findByUuid(uuid);

    if (!student) {
      throw new BadRequestException();
    }

    return student;
  }

  @UseGuards(DevRouteGuard)
  @Patch(":uuid")
  async update(
    @Param("uuid", new ParseUUIDPipe()) uuid: string,
    @Body() updateStudentDto: UpdateStudentDto
  ): Promise<UpdateResult> {
    const updateResult = await this.studentService.update(
      uuid,
      updateStudentDto
    );

    if (!updateResult) {
      throw new BadRequestException();
    }

    return updateResult;
  }

  @UseGuards(DevRouteGuard)
  @Delete(":uuid")
  async remove(
    @Param("uuid", new ParseUUIDPipe()) uuid: string
  ): Promise<DeleteResult> {
    const deleteResult = await this.studentService.remove(uuid);

    if (!deleteResult) {
      throw new BadRequestException();
    }

    return deleteResult;
  }
}
