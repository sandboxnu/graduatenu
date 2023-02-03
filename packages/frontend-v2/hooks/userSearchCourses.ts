import useSWR, {SWRResponse} from "swr";
import { SearchAPI } from "@graduate/api-client";
import { AxiosError } from "axios";
import { ScheduleCourse2 } from "@graduate/common";

type SearchCoursesResponse = Omit<SWRResponse<ScheduleCourse2<null>[], AxiosError | Error>, "data" | "mutate">

type SearchCoursesReturn = SearchCoursesResponse & {
    courses? : ScheduleCourse2<null>[];
    isLoading : boolean;
}

/**
 * 
 * @param subject - the type of class that we are fetching from SearchNEU
 * @param classId - the identification number of the class as a string
 */
export function useSearchCourses(searchQuery: string, minIndex = 0, maxIndex = 9999): SearchCoursesReturn{
    
    const key = `
    {
      search(termId:"202130", query: "${searchQuery}", classIdRange: {min: ${minIndex}, max: ${maxIndex}}) {
        totalCount 
        pageInfo { hasNextPage } 
        nodes { ... on ClassOccurrence { name subject maxCredits minCredits prereqs coreqs classId
        } 
      } 
    } 
  }`;

      const {data, ...rest} = useSWR(
        key,
        async () => await SearchAPI.searchCourses(key)
      );

      return {
        ...rest,
        courses: data,
        isLoading: !data && !rest.error,
      }
}