import { createMock } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import { PlanShareService } from "../plan-share.service";

describe("PlanShareService", () => {
  let service: PlanShareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanShareService],
    })
      .useMocker(() => createMock())
      .compile();

    service = module.get<PlanShareService>(PlanShareService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
