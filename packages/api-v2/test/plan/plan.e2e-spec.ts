import { INestApplication } from "@nestjs/common";
import { Plan } from "../../src/plan/entities/plan.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { dropStudentTable, initializeApp } from "../../test/utils";

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

const testUser2 = {
  fullName: "Tester",
  nuid: "000000000",
  email: "test-plan2@gmail.com",
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
    app = await initializeApp()

    connection = app.get(Connection);

    // create student
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser);

    // save accessToken and user ID
    jwtToken = res.body.accessToken;
    uuid = res.body.uuid;
  
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
    await dropStudentTable(connection)
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates a plan for a signed in user", async () => {
    await request(app.getHttpServer())
      .post("/plans")
      .set("Authorization", `Bearer ${jwtToken}`)
      .send(testPlan)
      .expect(201);

    await request(app.getHttpServer())
      .get(`/plans/${planID}`)
      .set("Authorization", `Bearer ${jwtToken}`)
      .expect(200)
  });

  it("fails to create a plan for an unauthorized user", () => {
    return request(app.getHttpServer())
      .post("/plans")
      .send(testPlan)
      .expect(401);
  });

  it("fails to create a plan for a user with an invalid token", () => {
    return request(app.getHttpServer())
      .post("/plans")
      .set("Authorization", "Bearer foo")
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

  it("fails to update a plan that does not belong to a user", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser2);
    
    await request(app.getHttpServer()).patch(`/plans/${planID}`)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .send({ catalogYear: 2018 })
      .expect(403);
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

  it("fails to delete a plan that does not belong to a user", async() => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser2);
    
      await request(app.getHttpServer())
      .delete(`/plans/${planID}`)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(403);
  })
});
