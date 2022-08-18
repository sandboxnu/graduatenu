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
        throw new Error("Plans not returned along with the student by the API");
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

const prepareTermForDnd = (
  term: ScheduleTerm2<null>,
  courseCount: number
): { dndTerm: ScheduleTerm2<string>; updatedCount: number } => {
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
