import useSWR, {SWRResponse} from "swr";
import { SearchAPI } from "@graduate/api-client";
import { AxiosError } from "axios";
import { ScheduleCourse2 } from "@graduate/common";

type FetchCoursesResponse = Omit<SWRResponse<ScheduleCourse2<null>[], AxiosError | Error>, "data" | "mutate">

type FetchCoursesReturn = FetchCoursesResponse & {
    courses? : ScheduleCourse2<null>[];
    isLoading : boolean;
}

/**
 * 
 * @param subject - the type of class that we are fetching from SearchNEU
 * @param classId - the identification number of the class as a string
 */
export function useFetchSearchCourses(courses: {subject: string, classId: string}[]): FetchCoursesReturn{
    // formats the request data
    const input = courses
      .map((course) => {
        return `{subject: "${course.subject}", classId: "${course.classId}"}`;
      })
      .join(",");
    const key = `{
        bulkClasses(input: [${input}]) {
          latestOccurrence {
            name
            subject
            classId
            minCredits
            maxCredits
            prereqs
            coreqs
            termId
          }
        }
      }`;

      const {data, ...rest} = useSWR(
        key,
        async () => await SearchAPI.fetchCourses(key)
      );

      return {
        ...rest,
        courses: data,
        isLoading: !data && !rest.error,
      }
}