import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStudentDto } from 'src/student/dto/create-student.dto';
import { Student } from 'src/student/entities/student.entity';
import { AuthService } from './auth.service';
import { LoginStudentDto } from './dto/login-student.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<Student> {
    try {
      return await this.authService.register(createStudentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginStudentDto): Promise<Student> {
    try {
      return await this.authService.login(loginUserDto);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
