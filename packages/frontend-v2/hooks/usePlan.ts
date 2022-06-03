import useSWR, { SWRResponse } from "swr";
import { API } from "@graduate/api-client";
import { GetPlanResponse } from "@graduate/common";
import axios, { AxiosError } from "axios";
import { useRedirectUnAuth } from "./utils";

type planResponse = SWRResponse<GetPlanResponse, AxiosError>;

interface UsePlanReturn {
  plan?: planResponse["data"];
  error?: planResponse["error"];
  isLoading: boolean;
  mutatePlan: planResponse["mutate"];
}

export function usePlan(planId: number, jwt: string): UsePlanReturn {
  const key = `api/plans/${planId}`;
  const redirect = useRedirectUnAuth();
  const {
    data: plan,
    error,
    mutate: mutatePlan,
  } = useSWR(key, async () => await API.plans.get(planId, jwt));

  if (axios.isAxiosError(error)) {
    redirect(error);
  }

  return {
    plan,
    error,
    mutatePlan,
    isLoading: !plan && !error,
  };
}
