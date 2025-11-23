import { API } from "@graduate/api-client";
import { Major2 } from "@graduate/common";
import { AxiosError } from "axios";
import useSWR from "swr";

type MajorReturn = {
  majors: Major2[];
  isLoading: boolean;
  error?: AxiosError | Error;
};

/* Function that calls majors get API to fetch all information
 pertaining to majors in the students current plan  */
export function useMajor(
  catalogYear: number,
  majorNames: string[]
): MajorReturn {
  const safeMajorNames = (majorNames || []).filter(
    (name) => name && name.trim() !== ""
  );
  const key =
    safeMajorNames.length > 0
      ? `api/majors/${catalogYear}/${safeMajorNames.join(",")}`
      : null;

  const { data, error } = useSWR(key, async () => {
    const promises = safeMajorNames.map((majorName) =>
      API.majors.get(catalogYear, majorName)
    );
    return Promise.all(promises);
  });

  return {
    majors: data || [],
    isLoading: key !== null && !data && !error,
    error,
  };
}
