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
  email: "test-plan@gmail.com",
  password: "1234567890",
  academicYear: 2019,
  graduateYear: 2023,
  catalogYear: 2019,
  major: "Computer Science",
};

const testPlan = {
  name: "Test Plan",
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

describe("PlanController (e2e)", () => {
  let app: INestApplication;
  let jwtToken: string;
  let connection: Connection;
  let uuid: string;
  let planID: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    await app.init();
    connection = app.get(Connection);

    // insert plan into db
    await connection
      .createQueryBuilder()
      .insert()
      .into(Plan)
      .values([{ ...testPlan, student: { uuid, ...testUser } }])
      .execute();

    // record plan ID
    const plan = await connection
      .createQueryBuilder()
      .select("plan")
      .from(Plan, "plan")
      .where("plan.name = :name", { name: "Test Plan" })
      .getOne();

    planID = plan.id;
  });

  afterEach(async () => {
    // remove plan from db
    await connection
      .createQueryBuilder()
      .delete()
      .from(Plan)
      .where("name = :name", { name: "Test Plan" })
      .execute();
  });

  afterAll(async () => {
    // remove student from db
    await connection
      .createQueryBuilder()
      .delete()
      .from(Student)
      .where("email = :email", { email: "test-plan@gmail.com" })
      .execute();

    await app.close();
  });

  it("creates a plan for a signed in user", async () => {
    // create student
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser);

    // save accessToken and user ID
    jwtToken = res.body.accessToken;
    uuid = res.body.uuid;

    await request(app.getHttpServer())
      .post("/plans")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(testPlan)
      .expect(201);
  });

  it("fails to create a plan for an unauthorized user", () => {
    return request(app.getHttpServer())
      .post("/plans")
      .send(testPlan)
      .expect(401);
  });

  it("gets a user's plan by id", async () => {
    await request(app.getHttpServer())
      .get(`/plans/${planID}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);
  });

  it("fails to get a plan for an unauthorized user", async () => {
    await request(app.getHttpServer()).get(`/plans/${planID}`).expect(401);
  });

  it("updates a user's plan by id", async () => {
    await request(app.getHttpServer())
      .patch(`/plans/${planID}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .send({ catalogYear: 2018 })
      .expect(200);
  });

  it("fails to update a plan for an unauthorized user", async () => {
    await request(app.getHttpServer())
      .patch(`/plans/${planID}`)
      .send({ catalogYear: 2018 })
      .expect(401);
  });

  it("deletes a user's plan by id", async () => {
    await request(app.getHttpServer())
      .delete(`/plans/${planID}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200);
  });

  it("fails to delete a plan for an unauthorized user", async () => {
    await request(app.getHttpServer()).delete(`/plans/${planID}`).expect(401);
  });
});
