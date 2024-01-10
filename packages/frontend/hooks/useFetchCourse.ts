import useSWR, { SWRResponse } from "swr";
import { SearchAPI } from "@graduate/api-client";
import { AxiosError } from "axios";
import { ScheduleCourse2 } from "@graduate/common";

type FetchCourseResponse = Omit<
  SWRResponse<ScheduleCourse2<null>, AxiosError | Error>,
  "data" | "mutate"
>;

type FetchCoursesReturn = FetchCourseResponse & {
  course?: ScheduleCourse2<null>;
  isLoading: boolean;
};

/**
 * @param subject - The type of class that we are fetching from SearchNEU
 * @param classId - The identification number of the class as a string
 */
export function useFetchCourse(
  subject: string,
  classId: string
): FetchCoursesReturn {
  const { data, ...rest } = useSWR(
    `/fetchCourses/${subject}/${classId}`,
    async () => await SearchAPI.fetchCourse(subject, classId)
  );

  return {
    ...rest,
    course: data,
    isLoading: !data && !rest.error,
  };
}
