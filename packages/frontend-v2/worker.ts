import { Major2, MajorValidationResult, ScheduleCourse2, validateMajor2 } from "@graduate/common";

export interface WorkerPostInfo {
  major: Major2,
  taken: ScheduleCourse2<unknown>[],
  concentration?: string
}


export type WorkerMessage = Loaded | ValidationResult

export type ValidationResult = {type: "ValidationResult", result: MajorValidationResult}
export type Loaded = {type: "Loaded"}

// Let the host page know the worker is ready.
postMessage({type: "Loaded"})

// A number to help avoid sending stale validation info.
let currentValidationPosition = 0

addEventListener("message", ({data}: MessageEvent<WorkerPostInfo>) => {
  currentValidationPosition += 1
  const validationPosition = currentValidationPosition

  const validationResult: ValidationResult = {
    type:"ValidationResult",
    result: validateMajor2(data.major, data.taken, data.concentration)
  }

  // Only send valdation information if it was from the latest request.
  // This helps us avoid sending outdated information that could be sent
  // due to race conditions.
  if (validationPosition === currentValidationPosition) {
    postMessage(validationResult)
  }
})