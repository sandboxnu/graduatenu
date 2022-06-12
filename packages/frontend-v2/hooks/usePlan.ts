import useSWR, { KeyedMutator, SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetPlanResponse } from "@graduate/common";
import { AxiosError } from "axios";

type PlanResponse = Omit<
  SWRResponse<GetPlanResponse, AxiosError>,
  "data" | "mutate"
>;

type UsePlanReturn = PlanResponse & {
  plan?: GetPlanResponse;
  isLoading: boolean;
  mutatePlan: KeyedMutator<GetPlanResponse>;
};

/**
 * Gets the specified plan from the given planId in SWR.
 * @param planId The specific plan to retrieve.
 * @param jwt JWT for authentication. Will later be removed when we switch to cookies.
 */
export function usePlan(planId: number, jwt: string): UsePlanReturn {
  const key = `api/plans/${planId}`;

  const { data, mutate, ...rest } = useSWR(
    key,
    async () => await API.plans.get(planId, jwt)
  );

  return {
    ...rest,
    plan: data,
    mutatePlan: mutate,
    isLoading: !data && !rest.error,
  };
}
