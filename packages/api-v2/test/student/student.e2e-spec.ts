import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Plan } from "../../src/plan/entities/plan.entity";
import { Student } from "../../src/student/entities/student.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { AppModule } from "../../src/app.module";

const testUser = {
  fullName: "Tester",
  nuid: "000000000",
  email: "test-student@gmail.com",
  password: "1234567890",
  academicYear: 2019,
  graduateYear: 2023,
  catalogYear: 2019,
  major: "Computer Science",
};

const testPlan = {
  name: "Test Student",
  schedule: {
    years: [2019, 2020, 2021, 2022],
    yearMap: {},
  },
  major: "Computer Science",
  coopCycle: "4 year 2 co-ops",
  concentration: "Artificial Intelligence",
  catalogYear: 2019,
  courseWarnings: [],
  warnings: [],
};

describe("StudentController (e2e)", () => {
  let app: INestApplication;
  let jwtToken: string;
  let connection: Connection;
  let uuid: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    await app.init();

    connection = app.get(Connection);

    // register student
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser);

    // record access token & userID
    jwtToken = res.body.accessToken;
    uuid = res.body.uuid;
  });

  afterEach(async () => {
    // remove student from db
    await connection
      .createQueryBuilder()
      .delete()
      .from(Student)
      .execute();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should successfully get a student", async () => {
    await request(app.getHttpServer())
      .get("/students/me")
      .set("Authorization", `Bearer ${jwtToken}`)
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
      .values([{ ...testPlan, student: { uuid, ...testUser } }])
      .execute();

    const res = await request(app.getHttpServer())
      .get("/students/me")
      .set("Authorization", `Bearer ${jwtToken}`)
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
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);
  });

  it("should not delete a student without authorization token", () => {
    return request(app.getHttpServer()).delete("/students/me").expect(401);
  });

  it("should successfully delete a student", async () => {
    await request(app.getHttpServer())
      .delete("/students/me")
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);
  });
});
