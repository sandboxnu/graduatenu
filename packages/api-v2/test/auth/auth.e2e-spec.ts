import { INestApplication } from "@nestjs/common";
import { Student } from "../../src/student/entities/student.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { dropStudentTable, initializeApp } from "../../test/utils";
import { testUser1 } from "../../test/testingData";

jest.useRealTimers();
jest.setTimeout(50000);

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    app = await initializeApp();
    connection = app.get(Connection);

    // register student
    await request(app.getHttpServer()).post("/auth/register").send(testUser1);
  });

  afterEach(async () => {
    await dropStudentTable(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  it("registers a new user", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email: "test-register@gmail.com",
        password: "1234567890a",
        passwordConfirm: "1234567890a",
      })
      .expect(201);

    const cookie = res.header["set-cookie"];
    expect(cookie).toBeDefined();

    await request(app.getHttpServer())
      .get("/students/me")
      .set("Cookie", cookie)
      .expect(200);
  });

  it("fails to register an existing user", async () => {
    connection
      .createQueryBuilder()
      .insert()
      .into(Student)
      .values([{ ...testUser1 }]);

    await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser1)
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser1)
      .expect(400);
  });

  it("logs in with valid credentials", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser1)
      .expect(201);

    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send(testUser1)
      .expect(201);

    const cookie = res.header["set-cookie"];
    expect(cookie).toBeDefined();
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
