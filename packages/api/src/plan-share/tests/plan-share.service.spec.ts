import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PlanShareService } from "../plan-share.service";
import { PlanShare } from "../entities/plan-share.entity";
import { Student } from "../../student/entities/student.entity";
import { generateCode } from "../../utils/generate-code";

jest.mock("../../utils/generate-code", () => ({
  generateCode: jest.fn(),
}));

type Repo<_T> = {
  create: jest.Mock;
  save: jest.Mock;
  findOne: jest.Mock;
  findOneOrFail?: jest.Mock;
};

describe("PlanShareService unit tests", () => {
  let service: PlanShareService;
  let shares: Repo<PlanShare>;
  let students: { findOneOrFail: jest.Mock };

  const now = new Date("2025-10-28T00:00:00.000Z");
  const student: Partial<Student> = { uuid: "stu-123" };
  const planJson = { name: "Test Plan", schedule: { years: [{ year: 2022 }] } };

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(now);
  });

  beforeEach(() => {
    process.env.SHARE_BASE_URL = "https://graduatenu.com/share";

    shares = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    students = {
      findOneOrFail: jest.fn().mockResolvedValue(student),
    };

    (generateCode as jest.Mock).mockReset();

    service = new PlanShareService(shares as any, students as any);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("createShare", () => {
    it("creates a share and returns planCode, url, and expiresAt", async () => {
      (generateCode as jest.Mock).mockReturnValue("abc12");

      const createdShare = {
        planCode: "ABC12",
        planJson,
        expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        student,
        createdAt: now,
      };

      shares.create.mockImplementation((obj) => ({ ...obj, createdAt: now }));
      shares.save.mockResolvedValue(createdShare);

      const res = await service.createShare({
        studentUuid: "stu-123",
        planJson,
      });

      expect(students.findOneOrFail).toHaveBeenCalledWith({ uuid: "stu-123" });
      expect(generateCode).toHaveBeenCalledWith(5);
      expect(shares.create).toHaveBeenCalledWith({
        planCode: "ABC12",
        planJson,
        expiresAt: new Date("2025-11-11T00:00:00.000Z"),
        student,
      });
      expect(shares.save).toHaveBeenCalled();

      expect(res.planCode).toBe("ABC12");
      expect(res.url).toBe("https://graduatenu.com/share/ABC12");
      expect(res.expiresAt).toBe("2025-11-11T00:00:00.000Z");
    });

    it("retries on duplicate code and succeeds with a new code", async () => {
      (generateCode as jest.Mock)
        .mockReturnValueOnce("dup00")
        .mockReturnValueOnce("OK999");

      const duplicateErr = Object.assign(new Error("duplicate key"), {
        code: "duplicate",
      });
      shares.create.mockImplementation((obj) => obj);
      shares.save.mockRejectedValueOnce(duplicateErr).mockResolvedValueOnce({
        planCode: "OK999",
        planJson,
        expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        student,
        createdAt: now,
      });

      const res = await service.createShare({
        studentUuid: "stu-123",
        planJson,
      });

      expect(generateCode).toHaveBeenCalledTimes(2);
      expect(res.planCode).toBe("OK999");
      expect(res.url).toBe("https://graduatenu.com/share/OK999");
    });
  });

  describe("getSharedPlan", () => {
    it("throws plan code not found when missing", async () => {
      shares.findOne.mockResolvedValue(undefined);

      await expect(service.getSharedPlan("AAAAA")).rejects.toThrow(
        "plan code not found"
      );

      expect(shares.findOne).toHaveBeenCalledWith({
        where: { planCode: "AAAAA" },
        relations: ["student"],
      });
    });

    it("throws plan code has been revoked when revokedAt exists", async () => {
      shares.findOne.mockResolvedValue({
        planCode: "AAAAA",
        revokedAt: new Date("2025-10-01T00:00:00.000Z"),
        planJson,
        createdAt: now,
        expiresAt: new Date("2025-11-11T00:00:00.000Z"),
      });

      await expect(service.getSharedPlan("AAAAA")).rejects.toThrow(
        "plan code has been revoked"
      );
    });

    it("returns plan snapshot when valid", async () => {
      const share = {
        planCode: "AAAAA",
        revokedAt: null,
        planJson,
        createdAt: now,
        expiresAt: new Date("2025-11-01T00:00:00.000Z"),
      };
      shares.findOne.mockResolvedValue(share);

      const res = await service.getSharedPlan("aaaaa");

      expect(shares.findOne).toHaveBeenCalledWith({
        where: { planCode: "AAAAA" },
        relations: ["student"],
      });
      expect(res).toEqual({
        planJson,
        createdAt: share.createdAt,
        expiresAt: share.expiresAt,
      });
    });
  });

  describe("importSharedPlan", () => {
    it("returns success with planJson from getSharedPlan", async () => {
      const snapshot = {
        planJson,
        createdAt: now,
        expiresAt: new Date("2025-11-01T00:00:00.000Z"),
      };
      jest.spyOn(service, "getSharedPlan").mockResolvedValue(snapshot as any);

      const res = await service.importSharedPlan("stu-xyz", "ABCDE");

      expect(service.getSharedPlan).toHaveBeenCalledWith("ABCDE");
      expect(res).toEqual({
        success: true,
        planJson,
        message: "plan imported",
      });
    });
  });

  describe("deletePlanCode", () => {
    it("throws NotFoundException when code does not exist", async () => {
      shares.findOne.mockResolvedValue(undefined);

      await expect(
        service.deletePlanCode("stu-123", "ABCDE")
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(shares.findOne).toHaveBeenCalledWith({
        where: { planCode: "ABCDE" },
        relations: ["student"],
      });
    });

    it("throws ForbiddenException when code belongs to another student", async () => {
      shares.findOne.mockResolvedValue({
        planCode: "ABCDE",
        student: { uuid: "someone-else" },
      });

      await expect(
        service.deletePlanCode("stu-123", "ABCDE")
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("sets revokedAt and saves when owner deletes", async () => {
      const share: any = {
        planCode: "ABCDE",
        student: { uuid: "stu-123" },
        revokedAt: null,
      };
      shares.findOne.mockResolvedValue(share);
      shares.save.mockResolvedValue({ ...share, revokedAt: now });

      const res = await service.deletePlanCode("stu-123", "abcde");

      expect(shares.findOne).toHaveBeenCalledWith({
        where: { planCode: "ABCDE" },
        relations: ["student"],
      });
      expect(shares.save).toHaveBeenCalledWith(
        expect.objectContaining({ revokedAt: expect.any(Date) })
      );
      expect(res).toEqual({
        success: true,
        message: "share link revoked",
      });
    });
  });
});
