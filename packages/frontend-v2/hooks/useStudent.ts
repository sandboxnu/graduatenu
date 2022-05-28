import useSWR, { SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetStudentResponse } from "@graduate/common";
import { AxiosError } from "axios";

type studentResponse = SWRResponse<GetStudentResponse, AxiosError>;

interface UseStudentReturn {
  student?: studentResponse["data"];
  isError?: studentResponse["error"];
  isLoading: boolean;
  mutateStudent: studentResponse["mutate"];
}

export function useStudentWithPlan(jwt: string): UseStudentReturn {
  const key = `api/students/me`;
  const {
    data: student,
    error: isError,
    mutate: mutateStudent,
  } = useSWR(key, async () => await API.student.getMeWithPlan(jwt));

  return {
    student,
    isError,
    mutateStudent,
    isLoading: !student && !isError,
  };
}
