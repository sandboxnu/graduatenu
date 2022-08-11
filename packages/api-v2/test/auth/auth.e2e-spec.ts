import { INestApplication } from "@nestjs/common";
import { Student } from "../../src/student/entities/student.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { dropStudentTable, initializeApp } from "../../test/utils";

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
    app = await initializeApp()
    connection = app.get(Connection)

    // register student
    await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser)
  });

  afterEach(async () => {
    await dropStudentTable(connection)
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

    expect(res.body.accessToken).toBeDefined();
    await request(app.getHttpServer())
      .get("/students/me")
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(200);
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
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "test-auth@gmail.com",
        password: "1234567890",
      })
      .expect(201);
      expect(res.body.accessToken).toBeDefined();
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
