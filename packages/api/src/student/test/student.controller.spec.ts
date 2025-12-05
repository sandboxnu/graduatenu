import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Student } from "../entities/student.entity";
import { StudentController } from "../student.controller";
import { StudentService } from "../student.service";
import { SeasonEnum } from "@graduate/common";
import { BadRequestException } from "@nestjs/common";

describe("StudentController", () => {
  let controller: StudentController;
  let service: StudentService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getClassEnrollmentByMajor", () => {
    it("should return enrollment counts by major", async () => {
      const mockResult = {
        "Computer Science, BSCS": 3,
        "Data Science, BS": 2,
      };

      jest
        .spyOn(service, "countStudentsByClassAndMajor")
        .mockResolvedValue(mockResult);

      const result = await controller.getClassEnrollmentByMajor(
        "CS",
        "1210",
        1,
        "FL"
      );

      expect(result).toEqual(mockResult);
      expect(service.countStudentsByClassAndMajor).toHaveBeenCalledWith(
        "CS",
        "1210",
        1,
        SeasonEnum.FL
      );
    });

    it("should throw BadRequestException for missing parameters", async () => {
      await expect(
        controller.getClassEnrollmentByMajor("", "1210", 1, "FL")
      ).rejects.toThrow(BadRequestException);

      await expect(
        controller.getClassEnrollmentByMajor("CS", "", 1, "FL")
      ).rejects.toThrow(BadRequestException);

      await expect(
        controller.getClassEnrollmentByMajor("CS", "1210", null, "FL")
      ).rejects.toThrow(BadRequestException);

      await expect(
        controller.getClassEnrollmentByMajor("CS", "1210", 1, "")
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException for invalid season", async () => {
      await expect(
        controller.getClassEnrollmentByMajor("CS", "1210", 1, "INVALID")
      ).rejects.toThrow(BadRequestException);
    });

    it("should accept all valid seasons", async () => {
      const mockResult = {};
      jest
        .spyOn(service, "countStudentsByClassAndMajor")
        .mockResolvedValue(mockResult);

      const validSeasons = ["FL", "SP", "S1", "S2", "SM"];

      for (const season of validSeasons) {
        await expect(
          controller.getClassEnrollmentByMajor("CS", "1210", 1, season)
        ).resolves.toEqual(mockResult);
      }
    });
  });
});
