import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { initializeApp } from "../utils";

describe("MajorController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("retrieves the major for a valid year and major name", async () => {
    const response = await request(app.getHttpServer())
      .get("/majors/2022/Computer%20Science,%20BSCS")
      .expect(200);

    const major = response.body;
    expect(major.name).toBe("Computer Science, BSCS");
  });

  it("fails to retrieve a major from an invalid year", () => {
    const INVALID_YEAR = 2000;
    return request(app.getHttpServer())
      .get(`/majors/${INVALID_YEAR}/Computer%20Science,%20BSCS`)
      .expect(404);
  });

  it("fails to retrieve a major from a valid year but invalid major name", () => {
    const INVALID_MAJOR_NAME = "wrong";
    return request(app.getHttpServer())
      .get(`/majors/2022/${INVALID_MAJOR_NAME}`)
      .expect(404);
  });
});
