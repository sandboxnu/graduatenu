import { IScheduleCourse } from "./types";
/**
 * This module contains functions that generate warnings based off a schedule input.
 *
 * A Schedule is defined as a 2D list of IScheduleCourses, where the first nested list is a single semester.
 *
 * Functions produce warnings in the same order, where each list corresponds to each semester.
 */

interface IWarning {
    message: string;
}

/**
 * Checks that course prerequisites are met for each semester.
 * @param schedule The schedule to check.
 */
function checkPrerequisites(schedule: IScheduleCourse[][]): IWarning[][] {
    // todo: implement.
    return [];
}

/**
 * Checks that course corequisites are met for each semester.
 * @param schedule The schedule to check.
 */
function checkCorequisites(schedule: IScheduleCourse[][]): IWarning[][] {
    // todo: implement.
    return [];
}

/**
 * Checks that per-semester credit counts don't exceed 19.
 * @param schedule The schedule to check.
 */
function checkSemesterCredits(schedule: IScheduleCourse[][]): IWarning[][] {
    // todo: implement.
    return [];
}

/**
 * Checks that per-semester 4-credit course counts don't exceed 4.
 * @param schedule The schedule to check.
 */
function checkSemesterOverload(schedule: IScheduleCourse[][]): IWarning[][] {
    // todo: implement.
    return [];
}
