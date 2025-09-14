import { API } from "@graduate/api-client";
import { Minor } from "@graduate/common";
import { AxiosError } from "axios";
import useSWR from "swr";

type MinorReturn = {
  minors: Minor[];
  isLoading: boolean;
  error?: AxiosError | Error;
};

export function useMinor(
  catalogYear: number,
  minorNames?: string[]
): MinorReturn {
  if (!minorNames) {
    minorNames = [];
  }
  const key =
    minorNames.length > 0
      ? `api/minors/${catalogYear}/${minorNames?.join(",")}`
      : null;

  const { data, error } = useSWR(key, async () => {
    const promises = minorNames.map((minorName) =>
      API.minors.get(catalogYear, minorName)
    );
    return Promise.all(promises);
  });

  return {
    minors: data || [],
    isLoading: !data && !error,
    error,
  };
}
