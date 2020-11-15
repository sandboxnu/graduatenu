import { ScheduleCourse, IRequiredCourse } from "../../../../common/types";
import {
  DNDSchedule,
  IWarning,
  CourseWarning,
  NamedSchedule,
} from "../../models/types";
import { mockEmptySchedule } from "../../data/mockData";
import produce from "immer";
import { getType } from "typesafe-actions";
import { ScheduleAction, SchedulesAction, UserAction } from "../actions";
import {
  addClassesAction,
  removeClassAction,
  changeSemesterStatusAction,
  updateSemesterAction,
  setScheduleAction,
  setDNDScheduleAction,
  undoRemoveClassAction,
  setCoopCycle,
  setCompletedCourses,
  setCompletedRequirements,
  setTransferCourses,
  setNamedSchedule,
  setScheduleMajor,
  toggleYearExpanded,
  setClosedYearsToYearsInThePast,
  setCurrentClassCounter,
  incrementCurrentClassCounter,
} from "../actions/scheduleActions";
import { setSchedules, addNewSchedule } from "../actions/schedulesActions";
import {
  convertTermIdToSeason,
  convertToDNDSchedule,
  convertToDNDCourses,
  produceWarnings,
  sumCreditsFromList,
  numToTerm,
  getNextTerm,
  isYearInPast,
  clearSchedule,
} from "../../utils";
import { resetUserAction } from "../actions/userActions";

export interface ScheduleState {
  past?: ScheduleStateSlice;
  present: ScheduleStateSlice;
}

export interface ScheduleStateSlice {
  currentClassCounter: number;
  isScheduleLoading: boolean; // not used right now
  scheduleError: string; // not used right now
  schedule: DNDSchedule;
  warnings: IWarning[];
  courseWarnings: CourseWarning[];
  creditsTaken: number;
  completedRequirements: IRequiredCourse[];
  transferCourses: ScheduleCourse[];
  major: string;
  coopCycle: string;
  closedYears: number[]; // list of indexes for which years are not expanded in the UI
}

const initialState: ScheduleState = {
  present: {
    currentClassCounter: 0,
    isScheduleLoading: false,
    scheduleError: "",
    schedule: mockEmptySchedule,
    warnings: [],
    courseWarnings: [],
    creditsTaken: 0,
    completedRequirements: [],
    transferCourses: [],
    major: "",
    coopCycle: "",
    closedYears: [],
  },
};

export const scheduleReducer = (
  state: ScheduleState = initialState,
  action: ScheduleAction | SchedulesAction | UserAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(addClassesAction): {
        const { courses, semester } = action.payload;
        const season = convertTermIdToSeason(semester.termId);

        const [dndCourses, newCounter] = convertToDNDCourses(
          courses,
          draft.present.currentClassCounter
        );

        draft.present.currentClassCounter = newCounter;

        draft.present.schedule.yearMap[semester.year][season].classes.push(
          ...dndCourses
        );

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.present.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(removeClassAction): {
        const { course, semester } = action.payload;
        const season = convertTermIdToSeason(semester.termId);

        // save prev state with a deep copy
        draft.past = JSON.parse(JSON.stringify(draft.present));

        draft.present.schedule.yearMap[semester.year][
          season
        ].classes = draft.present.schedule.yearMap[semester.year][
          season
        ].classes.filter(c => c.dndId !== course.dndId);

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.present.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(undoRemoveClassAction): {
        draft.present = JSON.parse(JSON.stringify(draft.past));
        return draft;
      }
      case getType(changeSemesterStatusAction): {
        const { newStatus, year, season } = action.payload;
        draft.present.schedule.yearMap[year][season].status = newStatus;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.present.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(updateSemesterAction): {
        const { year, season, newSemester } = action.payload;
        draft.present.schedule.yearMap[year][season] = newSemester;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.present.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(setScheduleAction): {
        const schedule = JSON.parse(JSON.stringify(action.payload.schedule)); /// deep copy of schedule, because schedule is modified
        const [newSchedule, newCounter] = convertToDNDSchedule(
          JSON.parse(JSON.stringify(schedule)),
          draft.present.currentClassCounter
        );
        draft.present.schedule = newSchedule;
        draft.present.currentClassCounter = newCounter;

        const container = produceWarnings(schedule);

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(setCoopCycle): {
        const { coopCycle, schedule } = action.payload;
        if (!schedule) {
          return draft;
        }
        const [newSchedule, newCounter] = convertToDNDSchedule(
          schedule,
          draft.present.currentClassCounter
        );

        // remove all classes
        draft.present.schedule = clearSchedule(newSchedule);
        draft.present.currentClassCounter = 0;

        // clear all warnings
        draft.present.warnings = [];
        draft.present.courseWarnings = [];

        // set the coop cycle
        draft.present.coopCycle = coopCycle;

        return draft;
      }
      case getType(setScheduleMajor): {
        const { major } = action.payload;
        if (!major) {
          return draft;
        }
        draft.present.major = major.name;

        return draft;
      }
      case getType(setDNDScheduleAction): {
        draft.present.schedule = action.payload.schedule;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(action.payload.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;

        return draft;
      }
      case getType(setCompletedRequirements): {
        draft.present.completedRequirements =
          action.payload.completedRequirements;
        return draft;
      }
      case getType(setCompletedCourses): {
        const [dndCourses, newCounter] = convertToDNDCourses(
          // sort the completed courses so that when we add it to the schedule, it'll be more or less in order
          // for some reason it doesn't register classID as a string so I use toString
          action.payload.completedCourses.sort(
            (course1: ScheduleCourse, course2: ScheduleCourse) =>
              course1.classId
                .toString()
                .localeCompare(course2.classId.toString())
          ),
          draft.present.currentClassCounter
        );
        draft.present.currentClassCounter = newCounter;
        draft.present.creditsTaken = sumCreditsFromList(dndCourses);
        let curSchedule = draft.present.schedule;
        let classTerm = 0;
        // while there are still completed classes left to take and we have not passed the number of terms
        // in the schedule
        while (
          dndCourses.length != 0 ||
          classTerm >= curSchedule.years.length * 4
        ) {
          let curTerm = numToTerm(classTerm, curSchedule);
          // while the current term is not a class term, continue searching for the next class term.
          while (
            classTerm + 1 <= curSchedule.years.length * 4 &&
            curTerm.status != "CLASSES"
          ) {
            classTerm += 1;
            curTerm = numToTerm(classTerm, curSchedule);
          }
          let newCourses = getNextTerm(
            classTerm % 4 == 2 || classTerm % 4 == 3,
            dndCourses
          );
          curTerm.classes = newCourses;
          classTerm += 1;
        }

        const schedule = JSON.parse(JSON.stringify(curSchedule));
        const container = produceWarnings(schedule);

        draft.present.warnings = container.normalWarnings;
        draft.present.courseWarnings = container.courseWarnings;
        return draft;
      }
      case getType(setTransferCourses): {
        draft.present.transferCourses = action.payload.transferCourses;

        const [dndCourses, newCounter] = convertToDNDCourses(
          action.payload.transferCourses.sort(
            (course1: ScheduleCourse, course2: ScheduleCourse) =>
              course1.classId
                .toString()
                .localeCompare(course2.classId.toString())
          ),
          draft.present.currentClassCounter
        );

        draft.present.currentClassCounter += newCounter;
        draft.present.creditsTaken += sumCreditsFromList(dndCourses);
        return draft;
      }
      case getType(setNamedSchedule): {
        const namedSchedule = action.payload.namedSchedule.schedule.present;
        draft.present.warnings = namedSchedule.warnings;
        draft.present.courseWarnings = namedSchedule.courseWarnings;
        draft.present.currentClassCounter = namedSchedule.currentClassCounter;
        draft.present.schedule = namedSchedule.schedule;
        draft.present.major = namedSchedule.major;
        draft.present.coopCycle = namedSchedule.coopCycle;
        return draft;
      }
      case getType(addNewSchedule): {
        const { name, newSchedule } = action.payload;
        draft.present.warnings = newSchedule.warnings;
        draft.present.courseWarnings = newSchedule.courseWarnings;
        draft.present.currentClassCounter = newSchedule.currentClassCounter;
        draft.present.schedule = newSchedule.schedule;
        draft.present.major = newSchedule.major;
        draft.present.coopCycle = newSchedule.coopCycle;
        return draft;
      }
      case getType(setSchedules): {
        const namedSchedule = action.payload.schedules[0].schedule.present;
        draft.present.warnings = namedSchedule.warnings;
        draft.present.courseWarnings = namedSchedule.courseWarnings;
        draft.present.currentClassCounter = namedSchedule.currentClassCounter;
        draft.present.schedule = namedSchedule.schedule;
        draft.present.warnings = namedSchedule.warnings;
        return draft;
      }
      case getType(resetUserAction): {
        draft = initialState;
        return draft;
      }
      case getType(setClosedYearsToYearsInThePast): {
        draft.present.closedYears = [];
        for (var i = 0; i < draft.present.schedule.years.length; i++) {
          if (isYearInPast(i, action.payload.academicYear)) {
            draft.present.closedYears.push(i);
          }
        }
        return draft;
      }
      case getType(toggleYearExpanded): {
        const idx = action.payload.index;
        if (draft.present.closedYears.includes(idx)) {
          draft.present.closedYears.filter(year => year !== idx);
        } else {
          draft.present.closedYears.push(idx);
        }
        return draft;
      }
      case getType(setCurrentClassCounter): {
        draft.present.currentClassCounter = action.payload.currentClassCounter;
        return draft;
      }
      case getType(incrementCurrentClassCounter): {
        draft.present.currentClassCounter++;
        return draft;
      }
    }
  });
};
