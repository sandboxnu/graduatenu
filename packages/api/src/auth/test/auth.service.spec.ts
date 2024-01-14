import { createMock } from "@golevelup/ts-jest";
import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(() => createMock()) // useMocker mocks every dependency that isn't injected
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
