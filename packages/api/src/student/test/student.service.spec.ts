import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Student } from "../entities/student.entity";
import { StudentService } from "../student.service";
import { SeasonEnum, StatusEnum } from "@graduate/common";

describe("StudentService", () => {
  let service: StudentService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("countStudentsByClassAndMajor", () => {
    it("should count students by major taking a specific class", async () => {
      // Mock student data
      const mockStudents = [
        {
          uuid: "1",
          major: "Computer Science, BSCS",
          plans: [
            {
              major: "Computer Science, BSCS",
              schedule: {
                years: [
                  {
                    year: 1,
                    fall: {
                      season: SeasonEnum.FL,
                      status: StatusEnum.CLASSES,
                      classes: [
                        {
                          subject: "CS",
                          classId: "1210",
                          name: "Fund of CS 1",
                          numCreditsMin: 4,
                          numCreditsMax: 4,
                          id: null,
                        },
                      ],
                      id: null,
                    },
                    spring: {
                      season: SeasonEnum.SP,
                      status: StatusEnum.CLASSES,
                      classes: [],
                      id: null,
                    },
                    summer1: {
                      season: SeasonEnum.S1,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    summer2: {
                      season: SeasonEnum.S2,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    isSummerFull: false,
                  },
                ],
              },
            },
          ],
        },
        {
          uuid: "2",
          major: "Data Science, BS",
          plans: [
            {
              major: "Data Science, BS",
              schedule: {
                years: [
                  {
                    year: 1,
                    fall: {
                      season: SeasonEnum.FL,
                      status: StatusEnum.CLASSES,
                      classes: [
                        {
                          subject: "CS",
                          classId: "1210",
                          name: "Fund of CS 1",
                          numCreditsMin: 4,
                          numCreditsMax: 4,
                          id: null,
                        },
                      ],
                      id: null,
                    },
                    spring: {
                      season: SeasonEnum.SP,
                      status: StatusEnum.CLASSES,
                      classes: [],
                      id: null,
                    },
                    summer1: {
                      season: SeasonEnum.S1,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    summer2: {
                      season: SeasonEnum.S2,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    isSummerFull: false,
                  },
                ],
              },
            },
          ],
        },
        {
          uuid: "3",
          major: "Computer Science, BSCS",
          plans: [
            {
              major: "Computer Science, BSCS",
              schedule: {
                years: [
                  {
                    year: 1,
                    fall: {
                      season: SeasonEnum.FL,
                      status: StatusEnum.CLASSES,
                      classes: [
                        {
                          subject: "MATH",
                          classId: "1341",
                          name: "Calculus 1",
                          numCreditsMin: 4,
                          numCreditsMax: 4,
                          id: null,
                        },
                      ],
                      id: null,
                    },
                    spring: {
                      season: SeasonEnum.SP,
                      status: StatusEnum.CLASSES,
                      classes: [],
                      id: null,
                    },
                    summer1: {
                      season: SeasonEnum.S1,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    summer2: {
                      season: SeasonEnum.S2,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    isSummerFull: false,
                  },
                ],
              },
            },
          ],
        },
      ];

      mockRepository.find.mockResolvedValue(mockStudents);

      const result = await service.countStudentsByClassAndMajor(
        "CS",
        "1210",
        1,
        SeasonEnum.FL
      );

      expect(result).toEqual({
        "Computer Science, BSCS": 1,
        "Data Science, BS": 1,
      });
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ["plans"],
      });
    });

    it("should return empty object when no students are taking the class", async () => {
      const mockStudents = [
        {
          uuid: "1",
          major: "Computer Science, BSCS",
          plans: [
            {
              major: "Computer Science, BSCS",
              schedule: {
                years: [
                  {
                    year: 1,
                    fall: {
                      season: SeasonEnum.FL,
                      status: StatusEnum.CLASSES,
                      classes: [
                        {
                          subject: "MATH",
                          classId: "1341",
                          name: "Calculus 1",
                          numCreditsMin: 4,
                          numCreditsMax: 4,
                          id: null,
                        },
                      ],
                      id: null,
                    },
                    spring: {
                      season: SeasonEnum.SP,
                      status: StatusEnum.CLASSES,
                      classes: [],
                      id: null,
                    },
                    summer1: {
                      season: SeasonEnum.S1,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    summer2: {
                      season: SeasonEnum.S2,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    isSummerFull: false,
                  },
                ],
              },
            },
          ],
        },
      ];

      mockRepository.find.mockResolvedValue(mockStudents);

      const result = await service.countStudentsByClassAndMajor(
        "CS",
        "1210",
        1,
        SeasonEnum.FL
      );

      expect(result).toEqual({});
    });

    it("should skip plans without a major", async () => {
      const mockStudents = [
        {
          uuid: "1",
          major: null,
          plans: [
            {
              major: null, // Plan without major
              schedule: {
                years: [
                  {
                    year: 1,
                    fall: {
                      season: SeasonEnum.FL,
                      status: StatusEnum.CLASSES,
                      classes: [
                        {
                          subject: "CS",
                          classId: "1210",
                          name: "Fund of CS 1",
                          numCreditsMin: 4,
                          numCreditsMax: 4,
                          id: null,
                        },
                      ],
                      id: null,
                    },
                    spring: {
                      season: SeasonEnum.SP,
                      status: StatusEnum.CLASSES,
                      classes: [],
                      id: null,
                    },
                    summer1: {
                      season: SeasonEnum.S1,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    summer2: {
                      season: SeasonEnum.S2,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    isSummerFull: false,
                  },
                ],
              },
            },
          ],
        },
      ];

      mockRepository.find.mockResolvedValue(mockStudents);

      const result = await service.countStudentsByClassAndMajor(
        "CS",
        "1210",
        1,
        SeasonEnum.FL
      );

      expect(result).toEqual({});
    });

    it("should count students in different semesters correctly", async () => {
      const mockStudents = [
        {
          uuid: "1",
          major: "Computer Science, BSCS",
          plans: [
            {
              major: "Computer Science, BSCS",
              schedule: {
                years: [
                  {
                    year: 1,
                    fall: {
                      season: SeasonEnum.FL,
                      status: StatusEnum.CLASSES,
                      classes: [],
                      id: null,
                    },
                    spring: {
                      season: SeasonEnum.SP,
                      status: StatusEnum.CLASSES,
                      classes: [
                        {
                          subject: "CS",
                          classId: "1200",
                          name: "Fund of CS 2",
                          numCreditsMin: 4,
                          numCreditsMax: 4,
                          id: null,
                        },
                      ],
                      id: null,
                    },
                    summer1: {
                      season: SeasonEnum.S1,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    summer2: {
                      season: SeasonEnum.S2,
                      status: StatusEnum.INACTIVE,
                      classes: [],
                      id: null,
                    },
                    isSummerFull: false,
                  },
                ],
              },
            },
          ],
        },
      ];

      mockRepository.find.mockResolvedValue(mockStudents);

      // Should find in Spring
      const springResult = await service.countStudentsByClassAndMajor(
        "CS",
        "1200",
        1,
        SeasonEnum.SP
      );
      expect(springResult).toEqual({
        "Computer Science, BSCS": 1,
      });

      // Should not find in Fall
      const fallResult = await service.countStudentsByClassAndMajor(
        "CS",
        "1200",
        1,
        SeasonEnum.FL
      );
      expect(fallResult).toEqual({});
    });
  });
});
