import { validateMajor2 } from "@graduate/common";
import {
  Loaded,
  ValidationResult,
  WorkerMessageType,
  WorkerPostInfo,
} from "./worker-messages";

// Let the host page know the worker is ready.
const loadMessage: Loaded = { type: WorkerMessageType.Loaded };
postMessage(loadMessage);

addEventListener("message", ({ data }: MessageEvent<WorkerPostInfo>) => {
  const validationResult: ValidationResult = {
    type: WorkerMessageType.ValidationResult,
    result: validateMajor2(
      data.majors,
      data.taken,
      data.minors,
      data.concentration
    ),
    requestNumber: data.requestNumber,
  };

  postMessage(validationResult);
});
