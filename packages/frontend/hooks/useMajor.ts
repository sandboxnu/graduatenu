import { API } from "@graduate/api-client";
import { Major2 } from "@graduate/common";
import { AxiosError } from "axios";
import useSWR from "swr";

type MajorReturn = {
  majors: Major2[];
  isLoading: boolean;
  error?: AxiosError | Error;
};

export function useMajor(
  catalogYear: number,
  majorNames: string[]
): MajorReturn {
  const key =
    majorNames.length > 0
      ? `api/majors/${catalogYear}/${majorNames.join(",")}`
      : null;

  const { data, error } = useSWR(key, async () => {
    const promises = majorNames.map((majorName) =>
      API.majors.get(catalogYear, majorName)
    );
    return Promise.all(promises);
  });

  return {
    majors: data || [],
    isLoading: !data && !error,
    error,
  };
}
