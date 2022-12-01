import useSWR, { SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetSupportedMajorsResponse } from "@graduate/common";
import { AxiosError } from "axios";

type SupportedMajorsResponse = Omit<
  SWRResponse<GetSupportedMajorsResponse, AxiosError | Error>,
  "data" | "mutate"
>;

type SupportedMajorsReturn = SupportedMajorsResponse & {
  data?: GetSupportedMajorsResponse;
  isLoading: boolean;
};

/** Gets the majors we support, by year and name. */
export function useSupportedMajors(): SupportedMajorsReturn {
  const key = `api/majors/supportedMajors`;

  const { data, ...rest } = useSWR(
    key,
    async () => await API.majors.getSupportedMajors()
  );

  return {
    ...rest,
    data,
    isLoading: !data && !rest.error,
  };
}
