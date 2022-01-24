export class PlanNotFound extends Error {
  constructor(planId: number) {
    super(`A Plan with the id, ${planId}, is not found`);
  }
}
