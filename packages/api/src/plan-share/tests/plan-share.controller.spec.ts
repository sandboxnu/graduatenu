import { createMock } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import { PlanShareController } from "../plan-share.controller";
import { PlanShareService } from "../plan-share.service";

describe("PlanShareController", () => {
  let controller: PlanShareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanShareController],
      providers: [PlanShareService],
    })
      .useMocker(() => createMock())
      .compile();

    controller = module.get<PlanShareController>(PlanShareController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
