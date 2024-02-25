import useSWR, { KeyedMutator, SWRResponse } from "swr";
import { SearchAPI } from "@graduate/api-client";
import { AxiosError } from "axios";
import { NUPathEnum, ScheduleCourse2 } from "@graduate/common";

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
 * @param nupaths     - NUPaths to filter for and search for
 * @param minIndex    - The lower bound of course ID to search by. Default 0
 * @param maxIndex    - The upper bound of course ID to search by. Default 9999
 */
export function useSearchCourses(
  searchQuery: string,
  catalogYear?: number,
  nupaths?: NUPathEnum[],
  minIndex = 0,
  maxIndex = 9999
): SearchCoursesReturn {
  const { data, mutate, ...rest } = useSWR(
    `/searchCourses/${searchQuery}/${minIndex}/${maxIndex}${
      catalogYear && `/${catalogYear}`
    }${nupaths && nupaths?.length > 0 && `/${JSON.stringify(nupaths.sort())}`}`,
    async () =>
      await SearchAPI.searchCourses(
        searchQuery.trim(),
        catalogYear,
        nupaths,
        minIndex,
        maxIndex
      )
  );

  return {
    ...rest,
    courses: data,
    isLoading: !data && !rest.error,
    mutateCourses: mutate,
  };
}
