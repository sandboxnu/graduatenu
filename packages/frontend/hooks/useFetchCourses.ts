import useSWR, { SWRResponse } from "swr";
import { SearchAPI } from "@graduate/api-client";
import { AxiosError } from "axios";
import { ScheduleCourse2 } from "@graduate/common";

type FetchCoursesResponse = Omit<
  SWRResponse<ScheduleCourse2<null>[], AxiosError | Error>,
  "data" | "mutate"
>;

type FetchCoursesReturn = FetchCoursesResponse & {
  courses?: ScheduleCourse2<null>[];
  isLoading: boolean;
};

type courses = { subject: string; classId: string }[];

/**
 * @param subject - The type of class that we are fetching from SearchNEU
 * @param classId - The identification number of the class as a string
 */
export function useFetchCourses(
  courses: courses,
  catalogYear: number
): FetchCoursesReturn {
  const { data, ...rest } = useSWR(
    `/fetchCourses/${courses}`,
    async () => await SearchAPI.fetchCourses(courses, catalogYear)
  );

  return {
    ...rest,
    courses: data,
    isLoading: !data && !rest.error,
  };
}
