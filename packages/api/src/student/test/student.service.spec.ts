import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { StudentService } from "../student.service";
import { Student } from "../entities/student.entity";
import {
  EmailAlreadyExists,
  MustUseHuskyEmail,
  WeakPassword,
} from "../student.errors";

type MockRepo = {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

describe("StudentService.create", () => {
  let service: StudentService;
  let repo: MockRepo;

  const makeDto = (
    overrides: Partial<{
      email: string;
      fullName: string;
      password: string;
      passwordConfirm: string;
    }> = {}
  ) => ({
    email: "new@husky.neu.edu",
    fullName: "Test User",
    password: "StrongPass183202!!",
    passwordConfirm: "StrongPass183202!!",
    ...overrides,
  });

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        { provide: getRepositoryToken(Student), useValue: repo },
      ],
    }).compile();

    service = module.get(StudentService);
    jest.clearAllMocks();
  });

  it("returns EmailAlreadyExists when user already in DB", async () => {
    repo.findOne.mockResolvedValue({ id: 1, email: "exists@husky.neu.edu" });

    const result = await service.create(
      makeDto({ email: "exists@husky.neu.edu" })
    );

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { email: "exists@husky.neu.edu" },
    });
    expect(result).toBeInstanceOf(EmailAlreadyExists);
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("returns MustUseHuskyEmail for non-husky domain", async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.create(makeDto({ email: "user@gmail.com" }));

    expect(result).toBeInstanceOf(MustUseHuskyEmail);
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("returns null when password and confirm mismatch", async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.create(
      makeDto({ password: "Str0ngPassw0rd!", passwordConfirm: "Mismatch123!" })
    );

    expect(result).toBeNull();
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("returns WeakPassword when password is not strong", async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.create(
      makeDto({ password: "123", passwordConfirm: "123" })
    );

    expect(result).toBeInstanceOf(WeakPassword);
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("creates and saves student on success", async () => {
    repo.findOne.mockResolvedValue(null);
    const created = { email: "new@husky.neu.edu", fullName: "Test User" };
    const saved = { id: 42, ...created };

    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(saved);

    const result = await service.create(makeDto());

    expect(repo.create).toHaveBeenCalledWith({
      fullName: "Test User",
      email: "new@husky.neu.edu",
      password: "StrongPass183202!!",
    });
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(saved);
  });
});
