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
import { CreateStudentDto } from "@graduate/common/dto/create-student.dto";
import { UpdateStudentDto } from "@graduate/common/dto/update-student.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { DevRouteGuard } from "src/guards/dev-route.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request";
import {
  GetStudentResponse,
  UpdateStudentResponse,
} from "@graduate/common/response-types/student-response-type";

@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(
    @Req() req: AuthenticatedRequest,
    @Query("isWithPlans", new DefaultValuePipe(false), ParseBoolPipe)
    isWithPlans: boolean
  ): Promise<GetStudentResponse> {
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
  ): Promise<UpdateStudentResponse> {
    const uuid = req.user.uuid;
    const updateResult = await this.studentService.update(
      uuid,
      updateStudentDto
    );

    if (!updateResult) {
      throw new BadRequestException();
    }

    const student = await this.studentService.findByUuid(uuid, true);

    if (!student) {
      throw new BadRequestException();
    }

    return student;
  }

  @UseGuards(JwtAuthGuard)
  @Delete("me")
  async removeMe(@Req() req: AuthenticatedRequest): Promise<void> {
    const uuid = req.user.uuid;
    const deleteResult = await this.studentService.remove(uuid);

    if (!deleteResult) {
      throw new BadRequestException();
    }
  }

  // The following routes are only available in development
  @UseGuards(DevRouteGuard)
  @Post()
  // SHould we make a create student response?
  async create(
    @Body() createStudentDto: CreateStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.studentService.create(createStudentDto);

    if (!student) {
      throw new BadRequestException();
    }

    return student;
  }

  @UseGuards(DevRouteGuard)
  @Get()
  async findAll(): Promise<GetStudentResponse[]> {
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
  ): Promise<GetStudentResponse> {
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
  ): Promise<UpdateStudentResponse> {
    const updateResult = await this.studentService.update(
      uuid,
      updateStudentDto
    );

    if (!updateResult) {
      throw new BadRequestException();
    }

    const student = await this.studentService.findByUuid(uuid);

    if (!student) {
      throw new BadRequestException();
    }

    return student;
  }

  @UseGuards(DevRouteGuard)
  @Delete(":uuid")
  async remove(
    @Param("uuid", new ParseUUIDPipe()) uuid: string
  ): Promise<void> {
    const deleteResult = await this.studentService.remove(uuid);

    if (!deleteResult) {
      throw new BadRequestException();
    }
  }
}
