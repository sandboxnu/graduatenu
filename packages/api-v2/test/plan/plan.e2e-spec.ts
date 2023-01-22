import { INestApplication } from "@nestjs/common";
import { Plan } from "../../src/plan/entities/plan.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { dropStudentTable, initializeApp } from "../../test/utils";
import { testPlan, testUser1, testUser2 } from "../../test/testingData";

describe("PlanController (e2e)", () => {
  let app: INestApplication;
  let cookie: any;
  let connection: Connection;
  let uuid: string;
  let planID: number;

  beforeEach(async () => {
    app = await initializeApp();

    connection = app.get(Connection);

    // create student
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser1);

    // save accessToken and user ID
    cookie = res.header["set-cookie"];
    uuid = res.body.uuid;

    // insert plan into db
    await connection
      .createQueryBuilder()
      .insert()
      .into(Plan)
      .values([{ ...testPlan, student: { uuid, ...testUser1 } }])
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
    await dropStudentTable(connection);
    await connection.close();
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates a plan for a signed in user", async () => {
    await request(app.getHttpServer())
      .post("/plans")
      .set("Cookie", cookie)
      .send(testPlan)
      .expect(201);

    await request(app.getHttpServer())
      .get(`/plans/${planID}`)
      .set("Cookie", cookie)
      .expect(200);
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
      .set("Cookie", cookie)
      .expect(200);
  });

  it("fails to get a plan for an unauthorized user", async () => {
    await request(app.getHttpServer()).get(`/plans/${planID}`).expect(401);
  });

  it("updates a user's plan by id", async () => {
    await request(app.getHttpServer())
      .patch(`/plans/${planID}`)
      .set("Cookie", cookie)
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

    const badCookie = res.header["set-cookie"];

    await request(app.getHttpServer())
      .patch(`/plans/${planID}`)
      .set("Cookie", badCookie)
      .send({ catalogYear: 2018 })
      .expect(403);
  });

  it("deletes a user's plan by id", async () => {
    await request(app.getHttpServer())
      .delete(`/plans/${planID}`)
      .set("Cookie", cookie)
      .expect(200);
  });

  it("fails to delete a plan for an unauthorized user", async () => {
    await request(app.getHttpServer()).delete(`/plans/${planID}`).expect(401);
  });

  it("fails to delete a plan that does not belong to a user", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser2);

    const badCookie = res.header["set-cookie"];

    await request(app.getHttpServer())
      .delete(`/plans/${planID}`)
      .set("Cookie", badCookie)
      .expect(403);
  });
});
