import useSWR, {SWRResponse} from "swr";
import { SearchAPI } from "@graduate/api-client";
import { AxiosError } from "axios";
import { ScheduleCourse2 } from "@graduate/common";

type FetchCourseResponse = Omit<SWRResponse<ScheduleCourse2<null>, AxiosError | Error>, "data" | "mutate">

type FetchCourseReturn = FetchCourseResponse & {
    course? : ScheduleCourse2<null>;
    isLoading : boolean;
}

/**
 * 
 * @param subject - the type of class that we are fetching from SearchNEU
 * @param classId - the identification number of the class as a string
 */
export function useFetchSearchCourse(subject: string, classId: string): FetchCourseReturn{

    const key = `{ 
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

      const {data, ...rest} = useSWR(
        key,
        async () => await SearchAPI.fetchCourse(key)
      );

      return {
        ...rest,
        course: data,
        isLoading: !data && !rest.error,
      }
}