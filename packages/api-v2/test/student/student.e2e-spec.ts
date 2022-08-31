import { INestApplication } from "@nestjs/common";
import { Plan } from "../../src/plan/entities/plan.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { dropStudentTable, initializeApp } from "../../test/utils";
import { onboardedUser, testPlan, testUser1 } from "../../test/testingData";

describe("StudentController (e2e)", () => {
  let app: INestApplication;
  let cookie: any;
  let connection: Connection;
  let uuid: string;

  beforeEach(async () => {
    app = await initializeApp();

    connection = app.get(Connection);

    // register student
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser1);

    // record access token & userID
    cookie = res.header["set-cookie"];
    uuid = res.body.uuid;
  });

  afterEach(async () => {
    await dropStudentTable(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should successfully get a student", async () => {
    await request(app.getHttpServer())
      .get("/students/me")
      .set("Cookie", cookie)
      .expect(200);
  });

  it("should fail to get a student without authorization token", async () => {
    await request(app.getHttpServer()).get("/students/me").expect(401);
  });

  it("should get a student with plans", async () => {
    // create plan for student
    await connection
      .createQueryBuilder()
      .insert()
      .into(Plan)
      .values([{ ...testPlan, student: { uuid, ...testUser1 } }])
      .execute();

    const res = await request(app.getHttpServer())
      .get("/students/me")
      .set("Cookie", cookie)
      .query({ isWithPlans: true })
      .expect(200);

    // plan should be defined in the response
    expect(res.body.plans).toBeDefined();
  });

  it("should not update a student without authorization token", () => {
    return request(app.getHttpServer()).patch("/students/me").expect(401);
  });

  it("should successfully update a student", async () => {
    await request(app.getHttpServer())
      .patch("/students/me")
      .send({ graduateYear: 2022 })
      .set("Cookie", cookie)
      .expect(200);
  });

  it("should successfully onboard a student", async () => {
    const res = await request(app.getHttpServer())
      .patch("/students/me/onboard")
      .send(onboardedUser)
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.isOnboarded).toBe(true);
  });

  it("should not delete a student without authorization token", () => {
    return request(app.getHttpServer()).delete("/students/me").expect(401);
  });

  it("should successfully delete a student", async () => {
    await request(app.getHttpServer())
      .delete("/students/me")
      .set("Cookie", cookie)
      .expect(200);
  });
});
