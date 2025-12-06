import { INestApplication } from "@nestjs/common";
import { Plan } from "../../src/plan/entities/plan.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { dropStudentTable, initializeApp } from "../utils";
import { testPlan, testUser1, testUser2 } from "../testingData";

describe("PlanShareController (e2e)", () => {
  let app: INestApplication;
  let cookie: any;
  let connection: Connection;
  let uuid: string;
  let planID: number;
  let cookie2: any;
  //let planCode: string;

  beforeAll(async () => {
    app = await initializeApp();
    connection = app.get(Connection);

    //create a student
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser1);

    //save accessToken and user Id
    cookie = res.headers["set-cookie"];
    uuid = res.body.uuid;

    //insert plan into db
    await connection
      .createQueryBuilder()
      .insert()
      .into(Plan)
      .values([{ ...testPlan, student: { uuid, ...testUser1 } }])
      .execute();

    //record plan id
    const plan = await connection
      .createQueryBuilder()
      .select("plan")
      .from(Plan, "plan")
      .where("plan.name = :name AND plan.studentUuid = :uuid", {
        name: "Test Plan",
        uuid,
      })
      .getOne();

    planID = plan.id;

    // const shareRes = await request(app.getHttpServer())
    //   .post("/plans/share")
    //   .set("Cookie", cookie)
    //   .send({ planJson : testPlan})

    // planCode = shareRes.body.planCode;

    // second user
    const res2 = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser2);
    cookie2 = res2.headers["set-cookie"];
  });

  afterAll(async () => {
    await dropStudentTable(connection);
    await app.close();
    await connection.close();
  });

  async function createShareAndReturnCode(): Promise<string> {
    const res = await request(app.getHttpServer())
      .post("/plans/share")
      .set("Cookie", cookie)
      .send({ planJson: testPlan });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("planCode");
    return res.body.planCode as string;
  }

  //cannot create code an unauth user
  it("fails to create a plan code for an unauthorized user", () => {
    return request(app.getHttpServer())
      .post("/plans/share")
      .send({ planJson: testPlan })
      .expect(401);
  });

  //can create code as auth user
  //cannot get a code as unauth user
  //can get a code as auth user
  it("gets a shareable code for an authenticated user", async () => {
    await request(app.getHttpServer())
      .get(`/plans/${planID}`)
      .set("Cookie", cookie)
      .expect(200);
  });

  //cannot delete a plan that's not urs
  it("cannot delete a plan code that's not yours", async () => {
    const code = await createShareAndReturnCode();

    // try to delete as testUser2
    const del = await request(app.getHttpServer())
      .delete(`/plans/share/${code}`)
      .set("Cookie", cookie2);

    expect(del.status).toBe(403);
  });

  //can delete a plan that's urs
  it("can delete a plan code that's yours", async () => {
    const code = await createShareAndReturnCode();

    // delete as owner
    const del = await request(app.getHttpServer())
      .delete(`/plans/share/${code}`)
      .set("Cookie", cookie);

    expect([200, 204]).toContain(del.status);

    // verify it no longer resolves
    const view = await request(app.getHttpServer()).get(
      `/plans/share/view/${code}`
    );

    expect(view.status).toBe(500);
  });

  //can view a plan thats not urs
  it("can view a plan that's not yours", async () => {
    const code = await createShareAndReturnCode();

    // view as testUser2 (or public)
    const res = await request(app.getHttpServer())
      .get(`/plans/share/view/${code}`)
      .set("Cookie", cookie2);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("planJson");
    expect(res.body.planJson.name).toBe(testPlan.name);
  });
});
