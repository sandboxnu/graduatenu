import useSWR, { KeyedMutator, SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetStudentResponse, StudentModel } from "@graduate/common";
import axios, { AxiosError } from "axios";
import { defaultGuestStudent, preparePlanForDnd } from "../utils";
import { useContext } from "react";
import { IsGuestContext } from "../pages/_app";

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
  const { isGuest, setIsGuest } = useContext(IsGuestContext);

  const { data, mutate, ...rest } = useSWR(USE_STUDENT_WITH_PLANS_SWR_KEY, () =>
    fetchStudentAndPrepareForDnd(isGuest, setIsGuest)
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
export const fetchStudentAndPrepareForDnd = async (
  isGuest: boolean,
  setIsGuest: (value: boolean) => void
): Promise<StudentModel<string>> => {
  //for shared plans
  const pathname = window.location.pathname;
  const isSharedPlan = pathname.startsWith("/share");

  const studentString = window.localStorage.getItem("student");
  const studentFromLocalStorage: GetStudentResponse = studentString
    ? JSON.parse(studentString)
    : defaultGuestStudent;

  let student: GetStudentResponse;

  try {
    // (for plan sharing) not a guest, fetch the real user
    if (!isGuest) {
      student = await API.student.getMeWithPlan();
    } else {
      student = studentFromLocalStorage;
    }
  } catch (err) {
    // (for plan sharing)not guest but backend says 401, treat as guest
    if (
      axios.isAxiosError(err) &&
      err.response?.status === 401 &&
      isSharedPlan
    ) {
      setIsGuest(true);
      student = studentFromLocalStorage;
    } else {
      throw err; // real error
    }
  }
  const plansWithDndIds = student.plans.map(preparePlanForDnd);

  return {
    ...student,
    plans: plansWithDndIds,
  };
};
