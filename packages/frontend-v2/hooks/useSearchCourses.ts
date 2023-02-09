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
 * @param subject - The type of class that we are fetching from SearchNEU
 * @param classId - The identification number of the class as a string
 */
export function useSearchCourses(
  searchQuery: string,
  minIndex = 0,
  maxIndex = 9999
): SearchCoursesReturn {
  const key = constructKey(searchQuery, minIndex, maxIndex);

  const { data, mutate, ...rest } = useSWR(
    key,
    async () => await SearchAPI.searchCourses(key)
  );

  return {
    ...rest,
    courses: data,
    isLoading: !data && !rest.error,
    mutateCourses: mutate,
  };
}

export const getSearchCourses = async (
  searchQuery: string,
  minIndex = 0,
  maxIndex = 9999
): Promise<ScheduleCourse2<null>[]> => {
  if (!searchQuery) {
    return [];
  }

  const key = constructKey(searchQuery, minIndex, maxIndex);
  const courses = await SearchAPI.searchCourses(key);

  return courses;
};

const constructKey = (searchQuery: string, minIndex = 0, maxIndex = 9999) => {
  return `
    {
      search(termId:"202130", query: "${searchQuery}", classIdRange: {min: ${minIndex}, max: ${maxIndex}}) {
        totalCount 
        pageInfo { hasNextPage } 
        nodes { ... on ClassOccurrence { name subject maxCredits minCredits prereqs coreqs classId
        } 
      } 
    } 
  }`;
};
