import useSWR, { SWRResponse } from "swr";
import { SearchAPI } from "@graduate/api-client";
import { AxiosError } from "axios";
import { ScheduleCourse2 } from "@graduate/common";

type FetchCourseResponse = Omit<
  SWRResponse<ScheduleCourse2<null>, AxiosError | Error>,
  "data" | "mutate"
>;

type FetchCourseReturn = FetchCourseResponse & {
  course?: ScheduleCourse2<null> | null;
  isLoading: boolean;
};

/**
 * @param subject - The type of class that we are fetching from SearchNEU
 * @param classId - The identification number of the class as a string
 */
export function useFetchSearchCourse(
  subject: string,
  classId: string
): FetchCourseReturn {
  const key = constructKey(subject, classId);

  const { data, ...rest } = useSWR(
    key,
    async () => await SearchAPI.fetchCourse(key)
  );

  return {
    ...rest,
    course: data,
    isLoading: !data && !rest.error,
  };
}

export const fetchSearchCourse = async (
  subject: string,
  classId: string
): Promise<ScheduleCourse2<null> | null> => {
  const course = await SearchAPI.fetchCourse(constructKey(subject, classId));

  return course;
};

const constructKey = (subject: string, classId: string) => {
  return `{ 
    class(subject: "${subject}", classId: "${classId}") {
      latestOccurrence {
        name
        subject
        classId
        maxCredits
        minCredits
        prereqs
        coreqs
      }
    }
  }`;
};
