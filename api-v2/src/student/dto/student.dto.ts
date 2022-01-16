import { OmitType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

export class StudentDto extends OmitType(CreateStudentDto, ['password']) {}
