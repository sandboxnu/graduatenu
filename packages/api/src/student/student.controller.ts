import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { DevRouteGuard } from "../guards/dev-route.guard";
import { AuthenticatedRequest } from "../auth/interfaces/authenticated-request";
import {
  SignUpStudentDto,
  GetStudentResponse,
  OnboardStudentDto,
  UpdateStudentDto,
  UpdateStudentResponse,
  emailAlreadyExistsError,
  mustUseHuskyEmailError,
  weakPasswordError,
  ChangePasswordDto,
  wrongPasswordError,
  SeasonEnum,
} from "@graduate/common";
import {
  EmailAlreadyExists,
  WeakPassword,
  MustUseHuskyEmail,
  WrongPassword,
} from "./student.errors";

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

    if (!isWithPlans) {
      student.plans = [];
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
  @Patch("me/onboard")
  async onBoard(
    @Req() req: AuthenticatedRequest,
    @Body() onboardStudentDto: OnboardStudentDto
  ): Promise<UpdateStudentResponse> {
    const uuid = req.user.uuid;
    const updateResult = await this.studentService.update(uuid, {
      ...onboardStudentDto,
      isOnboarded: true,
    });

    if (!updateResult) {
      throw new InternalServerErrorException();
    }

    const student = await this.studentService.findByUuid(uuid, true);

    if (!student) {
      throw new InternalServerErrorException();
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

  @UseGuards(JwtAuthGuard)
  @Post("changePassword")
  public async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const changePasswordResult = await this.studentService.changePassword(
      req.user.uuid,
      changePasswordDto
    );
    if (changePasswordResult instanceof WrongPassword) {
      throw new BadRequestException(wrongPasswordError);
    }
    if (changePasswordResult instanceof WeakPassword) {
      throw new BadRequestException(weakPasswordError);
    }
  }

  // The following routes are only available in development
  @UseGuards(DevRouteGuard)
  @Post()
  async create(
    @Body() createStudentDto: SignUpStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.studentService.create(createStudentDto);

    if (student instanceof EmailAlreadyExists) {
      throw new BadRequestException(emailAlreadyExistsError);
    }

    if (student instanceof MustUseHuskyEmail) {
      throw new BadRequestException(mustUseHuskyEmailError);
    }

    if (student instanceof WeakPassword) {
      throw new BadRequestException(weakPasswordError);
    }

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
  @Get("course-interest")
  async getCourseInterest(
    @Query("season") season: string,
    @Query("major") major?: string,
    @Query("subject") subject?: string,
    @Query("classId") classId?: string
  ): Promise<{ count: number; students: string[] }> {
    if (!season) {
      throw new BadRequestException("Missing required query parameter: season");
    }

    if (!Object.values(SeasonEnum).includes(season as SeasonEnum)) {
      throw new BadRequestException(
        "Invalid season. Must be FL, SP, S1, S2, or SM"
      );
    }

    return this.studentService.getStudentInterest(
      season as SeasonEnum,
      major,
      subject,
      classId
    );
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
    @Body() updateStudentDto: SignUpStudentDto
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
