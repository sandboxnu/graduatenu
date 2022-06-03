import useSWR, { SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetStudentResponse } from "@graduate/common";
import axios, { AxiosError } from "axios";
import { useRedirectUnAuth } from "./utils";

type studentResponse = SWRResponse<GetStudentResponse, AxiosError>;

interface UseStudentReturn {
  student?: studentResponse["data"];
  error?: studentResponse["error"];
  isLoading: boolean;
  mutateStudent: studentResponse["mutate"];
}

export function useStudentWithPlan(jwt: string): UseStudentReturn {
  const key = `api/students/me`;
  const redirect = useRedirectUnAuth();

  const {
    data: student,
    error,
    mutate: mutateStudent,
  } = useSWR(key, async () => await API.student.getMeWithPlan(jwt));

  if (axios.isAxiosError(error)) {
    redirect(error);
  }

  return {
    student,
    error,
    mutateStudent,
    isLoading: !student && !error,
  };
}
