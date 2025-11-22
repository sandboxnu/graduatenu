import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Student } from "../entities/student.entity";
import { StudentController } from "../student.controller";
import { StudentService } from "../student.service";
import { PlanService } from "src/plan/plan.service";

describe("StudentController", () => {
  let controller: StudentController;
  let planService: PlanService;

  const mockRepository = {
    // mock repository methods like find and save here
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
        {
          provide: PlanService,
          useValue: planService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
