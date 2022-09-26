import useSWR, { KeyedMutator, SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetStudentResponse, StudentModel } from "@graduate/common";
import { AxiosError } from "axios";
import { preparePlanForDnd } from "../utils";

type StudentResponse = Omit<
  SWRResponse<GetStudentResponse, AxiosError | Error>,
  "data" | "mutate"
>;

type UseStudentReturn = StudentResponse & {
  isLoading: boolean;
  mutateStudent: KeyedMutator<StudentModel<string>>;
  student?: StudentModel<string>;
};

export const USE_STUDENT_WITH_PLANS_SWR_KEY = `api/students/me`;

/**
 * Returns the student with plan using SWR. Will later be removed when we switch
 * to cookies.
 */
export function useStudentWithPlans(): UseStudentReturn {
  const { data, mutate, ...rest } = useSWR(
    USE_STUDENT_WITH_PLANS_SWR_KEY,
    fetchStudentAndPrepareForDnd
  );

  return {
    ...rest,
    student: data,
    mutateStudent: mutate,
    isLoading: !data && !rest.error,
  };
}

/**
 * Fetches the student with plans and prepares all of the student's plans for
 * drag and drop by adding drag and drop ids.
 */
export const fetchStudentAndPrepareForDnd = async (): Promise<
  StudentModel<string>
> => {
  const student = await API.student.getMeWithPlan();
  const plansWithDndIds = student.plans.map(preparePlanForDnd);
  return {
    ...student,
    plans: plansWithDndIds,
  };
};
