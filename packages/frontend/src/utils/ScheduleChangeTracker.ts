import { convertTermIdToSeasonString, convertTermIdToYear } from ".";

/**
 * The ScheduleChangeTracker class defines the `getInstance` method that lets clients access
 * the unique ScheduleChangeTracker instance.
 */
class ScheduleChangeTracker {
  private static instance: ScheduleChangeTracker;
  private changes: string[];

  /**
   * The ScheduleChangeTracker constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this.changes = [];
  }

  /**
   * The static method that controls the access to the singleton instance.
   */
  public static getInstance(): ScheduleChangeTracker {
    if (!ScheduleChangeTracker.instance) {
      ScheduleChangeTracker.instance = new ScheduleChangeTracker();
    }

    return ScheduleChangeTracker.instance;
  }

  getSemesterSeasonYear(semester: number) {
    const semesterSeason = convertTermIdToSeasonString(semester);
    const semesterYear = convertTermIdToYear(semester);
    return semesterSeason + " " + semesterYear;
  }

  public addMoveClassChange(
    course: string,
    isFromSidebar: boolean,
    destinationSemester: number,
    _sourceSemester?: number
  ): void {
    const destination = this.getSemesterSeasonYear(destinationSemester);
    if (isFromSidebar) {
      this.changes.push("Moved " + course + " from sidebar to " + destination);
      return;
    }
    // TODO: Source id seems to be broken
    // const source = this.getSemesterSeasonYear(sourceSemester!);
    this.changes.push("Moved " + course + " to " + destination);
  }

  public addRemoveClassChange(course: string, semester: number): void {
    const sem = this.getSemesterSeasonYear(semester);
    this.changes.push("Deleted " + course + " from " + sem);
  }

  public addAddClassChange(course: string, semester: number): void {
    const sem = this.getSemesterSeasonYear(semester);
    this.changes.push("Added " + course + " to " + sem);
  }

  public getChanges() {
    return this.changes.join("\n");
  }

  public clearChanges(): void {
    this.changes = [];
  }
}

export default ScheduleChangeTracker;
