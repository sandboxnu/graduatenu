import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  GetStudentResponse,
  LoginStudentDto,
  CreateStudentDto,
} from "../../../common";

@Controller("auth")
export class AuthController {
  private readonly logger: Logger = new Logger();
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  public async register(
    @Body() createStudentDto: CreateStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.authService.register(createStudentDto);

    if (!student) {
      this.logger.warn(`${this.register.name}`);
      throw new BadRequestException();
    }

    return student;
  }

  @Post("login")
  public async login(
    @Body() loginUserDto: LoginStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.authService.login(loginUserDto);

    if (!student) {
      this.logger.warn(`${AuthController.name} - ${this.login.name}`);
      throw new UnauthorizedException();
    }

    return student;
  }
}
