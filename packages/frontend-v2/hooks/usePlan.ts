import useSWR, { SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetPlanResponse } from "@graduate/common";
import axios, { AxiosError } from "axios";
import { redirectUnAuth } from "./utils";

type planResponse = SWRResponse<GetPlanResponse, AxiosError>;

interface UsePlanReturn {
  plan?: planResponse["data"];
  error?: planResponse["error"];
  isLoading: boolean;
  mutatePlan: planResponse["mutate"];
}

export function usePlan(planId: string, jwt: string): UsePlanReturn {
  const key = `api/plans/${planId}`;
  const {
    data: plan,
    error,
    mutate: mutatePlan,
  } = useSWR(key, async () => await API.plans.get(planId, jwt));

  if (axios.isAxiosError(error)) {
    redirectUnAuth(error);
  }

  return {
    plan,
    error,
    mutatePlan,
    isLoading: !plan && !error,
  };
}
