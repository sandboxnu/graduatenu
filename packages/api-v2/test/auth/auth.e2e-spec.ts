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
  academicYear: 2019,
  graduateYear: 2023,
  catalogYear: 2019,
  major: "Computer Science",
};

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    await app.init();

    connection = app.get(Connection)

    // register student
    await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser)
  });

  afterEach(async () => {
    // delete student table
    await connection
      .createQueryBuilder()
      .delete()
      .from(Student)
      .execute()
  });

  afterAll(async () => {
    await app.close();
  });

  it("registers a new user", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        fullName: "Tester",
        nuid: "000000000",
        email: "test-register@gmail.com",
        password: "1234567890",
        academicYear: 2019,
        graduateYear: 2023,
        catalogYear: 2019,
        major: "Computer Science",
      })
      .expect(201);

    expect(res.body.accessToken).toBeDefined()
  });

  it("fails to register an existing user", async () => {
    connection.createQueryBuilder()
      .insert()
      .into(Student)
      .values([{...testUser}])

    await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser)
      .expect(400);
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
      .expect(401);
  });
});
