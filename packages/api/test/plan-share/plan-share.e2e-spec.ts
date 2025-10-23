import { INestApplication } from "@nestjs/common";
import { Plan } from "../../src/plan/entities/plan.entity";
import * as request from "supertest";
import { Connection } from "typeorm";
import { dropStudentTable, initializeApp } from "../utils";
import { testPlan, testUser1 } from "../testingData";

describe("PlanShareController (e2e)", () => {
  let app: INestApplication;
  let cookie: any;
  let connection: Connection;
  let uuid: string;
  let planID: number;
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
    //   .post("/api/plans/share")
    //   .set("Cookie", cookie)
    //   .send({ planJson : testPlan})

    // planCode = shareRes.body.planCode;
  });

  afterAll(async () => {
    await dropStudentTable(connection);
    await app.close();
    await connection.close();
  });

  //cannot create code an unauth user
  it("fails to create a plan code for an unauthorized user", () => {
    return request(app.getHttpServer())
      .post("/api/plans/share")
      .send({ planJson: testPlan })
      .expect(401);
  });

  //can create code as auth user
  //cannot get a code as unauth user
  //can get a code as auth user
  it("gets a shareable code for an authenticated user", async () => {
    await request(app.getHttpServer())
      .get(`/api/plans/${planID}`)
      .set("Cookie", cookie)
      .expect(200);
  });

  //cannot delete a plan that's not urs
  //can delete a plan that's urs
  //can view a plan thats not urs
});
