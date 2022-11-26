import { createMock } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import { MajorService } from "../major.service";

describe("Majorervice", () => {
  let service: MajorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MajorService],
    })
      .useMocker(() => createMock())
      .compile();

    service = module.get<MajorService>(MajorService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
