import useSWR, { KeyedMutator, SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import {
  GetStudentResponse,
  PlanModel,
  Schedule2,
  ScheduleTerm2,
  ScheduleYear2,
  StudentModel,
} from "@graduate/common";
import { AxiosError } from "axios";
import { logger } from "../utils";

type StudentResponse = Omit<
  SWRResponse<GetStudentResponse, AxiosError>,
  "data" | "mutate"
>;

type UseStudentReturn = StudentResponse & {
  isLoading: boolean;
  mutateStudent: KeyedMutator<StudentModel<string>>;
  student?: StudentModel<string>;
};

/**
 * Returns the student with plan using SWR. Will later be removed when we switch
 * to cookies.
 */
export function useStudentWithPlans(): UseStudentReturn {
  const key = `api/students/me`;

  const { data, mutate, ...rest } = useSWR(
    key,
    async (): Promise<StudentModel<string>> => {
      const student = await API.student.getMeWithPlan();

      if (!student.plans) {
        const errMsg = "Plans not returned along with the student by the API";
        logger.error("useStudentWithPlans", errMsg);
        throw new Error(errMsg);
      }

      // prepare all of the student's plans for drag and drop by adding drag and drop ids
      const plansWithDndIds = student.plans.map(preparePlanForDnd);
      return {
        ...student,
        plans: plansWithDndIds,
      };
    }
  );

  return {
    ...rest,
    student: data,
    mutateStudent: mutate,
    isLoading: !data && !rest.error,
  };
}

/**
 * Prepares a plan for drag and drop by adding drag and drop ids to semester
 * terms and courses.
 *
 * Term and courses need drag and drop ids since they behave as droppable and
 * draggable components respectively.
 */
const preparePlanForDnd = (plan: PlanModel<null>): PlanModel<string> => {
  let courseCount = 0;
  const dndYears: ScheduleYear2<string>[] = [];
  plan.schedule.years.forEach((year) => {
    let res;
    res = prepareTermForDnd(year.fall, courseCount);
    const dndFallTerm = res.dndTerm;
    courseCount = res.updatedCount;

    res = prepareTermForDnd(year.spring, courseCount);
    const dndSpringTerm = res.dndTerm;
    courseCount = res.updatedCount;

    res = prepareTermForDnd(year.summer1, courseCount);
    const dndSummer1Term = res.dndTerm;
    courseCount = res.updatedCount;

    res = prepareTermForDnd(year.summer2, courseCount);
    const dndSummer2Term = res.dndTerm;
    courseCount = res.updatedCount;

    dndYears.push({
      ...year,
      fall: dndFallTerm,
      spring: dndSpringTerm,
      summer1: dndSummer1Term,
      summer2: dndSummer2Term,
    });
  });

  const dndSchedule: Schedule2<string> = {
    ...plan.schedule,
    years: dndYears,
  };

  const dndPlan: PlanModel<string> = {
    ...plan,
    schedule: dndSchedule,
  };

  return dndPlan;
};

/**
 * Prepares a term for drag and drop by adding a unique id to the term and to
 * all of the courses within the term.
 *
 * @param   term        The term to prepare for dnd
 * @param   courseCount The count to start from, used to ensure that all courses
 *   get a unique id
 * @returns             The term tansformed for drag and drop along with the
 *   updated course count which can be used to prepare the next term
 */
const prepareTermForDnd = (
  term: ScheduleTerm2<null>,
  courseCount: number
): { dndTerm: ScheduleTerm2<string>; updatedCount: number } => {
  /*
   * course count shouldn't be needed since in most cases a course will appear only once in a plan,
   * however we don't enforce that by any means so it's good to be safe
   */
  let updatedCount = courseCount;

  // add a unique dnd id to all courses within the term
  const dndClasses = term.classes.map((course) => {
    updatedCount++;
    return {
      ...course,
      id: `${course.classId}-${course.subject}-${updatedCount}`,
    };
  });

  const dndTerm = {
    ...term,
    id: `${term.year}-${term.season}`, // add a unique dnd id to all terms
    classes: dndClasses,
  };

  return {
    dndTerm,
    updatedCount,
  };
};
