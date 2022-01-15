import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
