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

  public addChange(
    course: string,
    isFromSidebar: boolean,
    destinationSemester: number,
    sourceSemester?: number
  ): void {
    const destinationSemesterSeason = convertTermIdToSeasonString(
      destinationSemester
    );
    const destinationSemesterYear = convertTermIdToYear(destinationSemester);
    const destination =
      destinationSemesterSeason + " " + destinationSemesterYear;

    if (isFromSidebar) {
      console.log("Moved " + course + " from sidebar to " + destination);
      return;
    }

    const sourceSemesterSeason = convertTermIdToSeasonString(sourceSemester!);
    const sourceSemesterYear = convertTermIdToYear(sourceSemester!);
    const source = sourceSemesterSeason + " " + sourceSemesterYear;
    console.log("Moved " + course + " from " + source + " to " + destination);
  }

  public getChanges() {
    // ...
  }

  public clearChanges(): void {
    // ...
  }
}

export default ScheduleChangeTracker;
