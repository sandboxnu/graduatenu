import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";

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
    await Promise.all([app.close()]);
  });

  it("registers a new user", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        fullName: "Tester",
        nuid: "000000000",
        email: "test-register-student@gmail.com",
        password: "1234567890",
        academicYear: "2019",
        graduateYear: "2023",
        catalogYear: "2019",
        major: "Computer Science",
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete("/students/me")
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .expect(200);
  });

  it("registers an existing user", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        fullName: "Tester",
        nuid: "000000000",
        email: "aryan1@gmail.com",
        password: "i<3graduate",
        academicYear: "2019",
        graduateYear: "2023",
        catalogYear: "2019",
        major: "Computer Science",
      })
      .expect({ statusCode: 400, message: "Bad Request" });
  });

  it("logs in with valid credentials", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        fullName: "Jia Mu",
        nuid: "000000000",
        email: "test-login@gmail.com",
        password: "1234567890",
        academicYear: "2019",
        graduateYear: "2023",
        catalogYear: "2019",
        major: "Computer Engineering and Computer Science",
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "test-login@gmail.com",
        password: "1234567890",
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete("/students/me")
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .expect(200);
  });

  it("logs in with invalid credentials", () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "aryan1@gmail.com",
        password: "i<3graduate",
      })
      .expect({ statusCode: 401, message: "Unauthorized" });
  });
});
