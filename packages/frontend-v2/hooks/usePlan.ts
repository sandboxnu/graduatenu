import useSWR, { SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetPlanResponse } from "@graduate/common";
import { AxiosError } from "axios";

// Unsure what error type it will return
type planResponse = SWRResponse<GetPlanResponse, AxiosError>;

interface UsePlanReturn {
  plan?: planResponse["data"];
  isError?: planResponse["error"];
  isLoading: boolean;
  mutatePlan: planResponse["mutate"];
}

export function usePlan(planId: string, jwt: string): UsePlanReturn {
  const key = `api/plans/${planId}`;
  const {
    data: plan,
    error: isError,
    mutate: mutatePlan,
  } = useSWR(key, async () => await API.plans.get(planId, jwt));

  return {
    plan,
    isError,
    mutatePlan,
    isLoading: !plan && !isError,
  };
}
