import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Student } from "../../src/student/entities/student.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { AppModule } from "../../src/app.module";

const testUser = {
  fullName: "Tester",
  nuid: "000000000",
  email: "test-auth@gmail.com",
  password: "1234567890",
  academicYear: "2019",
  graduateYear: "2023",
  catalogYear: "2019",
  major: "Computer Science",
};

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    const connection = app.get(Connection);
    await connection
      .createQueryBuilder()
      .delete()
      .from(Student)
      .where("email = :email", { email: "test-auth@gmail.com" })
      .execute();

    await app.close();
  });

  it("registers a new user", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser)
      .expect(201);
  });

  it("fails to register an existing user", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser)
      .expect({ statusCode: 400, message: "Bad Request" });
  });

  it("logs in with valid credentials", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "test-auth@gmail.com",
        password: "1234567890",
      })
      .expect(201);
  });

  it("fails to log in with invalid credentials", () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "test-auth@gmail.com",
        password: "i<3graduate",
      })
      .expect({ statusCode: 401, message: "Unauthorized" });
  });
});
