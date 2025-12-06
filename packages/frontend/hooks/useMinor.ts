import { API } from "@graduate/api-client";
import { Minor } from "@graduate/common";
import { AxiosError } from "axios";
import useSWR from "swr";

type MinorReturn = {
  minors: Minor[];
  isLoading: boolean;
  error?: AxiosError | Error;
};

/* Function that calls minors get API to fetch all information
 pertaining to minors in the students current plan  */
export function useMinor(
  catalogYear: number,
  minorNames?: string[]
): MinorReturn {
  const safeMinorNames = (minorNames || []).filter(
    (name) => name && name.trim() !== ""
  );
  const key =
    safeMinorNames.length > 0
      ? `api/minors/${catalogYear}/${safeMinorNames.join(",")}`
      : null;

  const { data, error } = useSWR(key, async () => {
    const promises = safeMinorNames.map((minorName) =>
      API.minors.get(catalogYear, minorName)
    );
    return Promise.all(promises);
  });

  return {
    minors: data || [],
    isLoading: key !== null && !data && !error,
    error,
  };
}
