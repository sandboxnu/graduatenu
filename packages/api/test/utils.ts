import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { Student } from "../src/student/entities/student.entity";
import { Connection } from "typeorm";
import * as cookieParser from "cookie-parser";

export const initializeApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.use(cookieParser());

  await app.init();

  return app;
};

export const dropStudentTable = async (connection: Connection) => {
  // delete student table
  await connection.createQueryBuilder().delete().from(Student).execute();
};
