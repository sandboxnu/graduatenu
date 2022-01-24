import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),
    StudentModule,
    AuthModule,
    PlanModule,
  ],
})
export class AppModule {}
