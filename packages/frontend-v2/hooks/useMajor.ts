import useSWR, { SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { Major2 } from "@graduate/common";
import { AxiosError } from "axios";

type MajorResponse = Omit<
  SWRResponse<Major2, AxiosError | Error>,
  "data" | "mutate"
>;

type MajorReturn = MajorResponse & {
  major?: Major2;
  isLoading: boolean;
};

/**
 * Gets the major by the major name and year.
 *
 * @param majorName The name of the major, ex: "Computer Science, BSCS".
 */
export function useMajor(catalogYear: number, majorName: string): MajorReturn {
  const key = `api/majors/${catalogYear}/${majorName}`;

  const { data, ...rest } = useSWR(
    key,
    async () => await API.majors.get(catalogYear, majorName)
  );

  return {
    ...rest,
    major: data,
    isLoading: !data && !rest.error,
  };
}
