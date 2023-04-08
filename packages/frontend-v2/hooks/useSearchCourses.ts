import useSWR, { KeyedMutator, SWRResponse } from "swr";
import { SearchAPI } from "@graduate/api-client";
import { AxiosError } from "axios";
import { ScheduleCourse2 } from "@graduate/common";

type SearchCoursesResponse = Omit<
  SWRResponse<ScheduleCourse2<null>[], AxiosError | Error>,
  "data" | "mutate"
>;

type SearchCoursesReturn = SearchCoursesResponse & {
  courses?: ScheduleCourse2<null>[];
  isLoading: boolean;
  mutateCourses: KeyedMutator<ScheduleCourse2<null>[]>;
};

/**
 * @param searchQuery - The user query term for the class they are searching for
 * @param minIndex    - The lower bound of course ID to search by. Default 0
 * @param maxIndex    - The upper bound of course ID to search by. Default 9999
 */
export function useSearchCourses(
  searchQuery: string,
  minIndex = 0,
  maxIndex = 9999
): SearchCoursesReturn {
  const { data, mutate, ...rest } = useSWR(
    `/searchCourses/${searchQuery}/${minIndex}/${maxIndex}`,
    async () =>
      await SearchAPI.searchCourses(searchQuery.trim(), minIndex, maxIndex)
  );

  return {
    ...rest,
    courses: searchQuery ? data : [],
    isLoading: !data && !rest.error,
    mutateCourses: mutate,
  };
}
