import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";

describe("StudentController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it("should fail to get a student without authorization token", async () => {
    return request(app.getHttpServer()).get("/students/me").expect(401);
  });

  it("should successfully get a student", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        fullName: "Tester",
        nuid: "000000000",
        email: "test-get@gmail.com",
        password: "1234567890",
        academicYear: "2019",
        graduateYear: "2023",
        catalogYear: "2019",
        major: "Computer Engineering and Computer Science",
      })
      .expect(201);

    await request(app.getHttpServer())
      .get("/students/me")
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete("/students/me")
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .expect(200);
  });

  it("should not update a student without authorization token", () => {
    return request(app.getHttpServer()).patch("/students/me").expect(401);
  });

  it("should successfully update a student", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        fullName: "Tester",
        nuid: "000000000",
        email: "test-update@gmail.com",
        password: "1234567890",
        academicYear: "2019",
        graduateYear: "2023",
        catalogYear: "2019",
        major: "Computer Engineering and Computer Science",
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch("/students/me")
      .send({ graduateYear: 2022 })
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete("/students/me")
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .expect(200);
  });

  it("should not delete a student without authorization token", () => {
    return request(app.getHttpServer()).delete("/students/me").expect(401);
  });

  it("should successfully delete a student", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        fullName: "Tester",
        nuid: "000000000",
        email: "test-delete@gmail.com",
        password: "1234567890",
        academicYear: "2019",
        graduateYear: "2023",
        catalogYear: "2019",
        major: "Computer Engineering and Computer Science",
      })
      .expect(201);

    return request(app.getHttpServer())
      .delete("/students/me")
      .set("Authorization", `Bearer ${response.body.accessToken}`)
      .expect(200);
  });

  // it("/ (POST)", () => {});

  // it("/ (GET)", () => {});

  // it("/:uuid (GET)", () => {});

  // it("/:uuid (PATCH)", () => {});

  // it("/:uuid (DELETE)", () => {});
});
