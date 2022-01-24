export class StudentNotFound extends Error {
  constructor() {
    super(`A Student with the given id, is not found`);
  }
}
