import { CopyIcon } from "@chakra-ui/icons";
import { API } from "@graduate/api-client";
import { CreatePlanDto, PlanModel } from "@graduate/common";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { USE_STUDENT_WITH_PLANS_SWR_KEY } from "../../hooks";
import { cleanDndIdsFromPlan, handleApiClientError } from "../../utils";
import { BlueButton } from "../Button";

interface DuplicatePlanButton {
  plan: PlanModel<string>;
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
}

export const DuplicatePlanButton: React.FC<DuplicatePlanButton> = ({
  plan,
  setSelectedPlanId,
}) => {
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);

  const duplicatePlan = async () => {
    // TODO: figure out when to do with this
    setButtonLoading(true);

    const updatedPlan: CreatePlanDto = {
      name: "Copy of " + plan.name,
      catalogYear: plan.catalogYear,
      major: plan.major,
      concentration: plan.concentration,
      schedule: cleanDndIdsFromPlan(plan).schedule,
    };
    try {
      const createdPlan = await API.plans.create(updatedPlan);
      mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
      setSelectedPlanId(createdPlan.id);
      toast.success("Plan duplicated successfully");
      setButtonLoading(false);
    } catch (error) {
      handleApiClientError(error as Error, router);
      setButtonLoading(false);
    }
  };

  return (
    <BlueButton
      onClick={duplicatePlan}
      leftIcon={<CopyIcon />}
      ml="xs"
      size="md"
      isLoading={buttonLoading}
    >
      Duplicate Plan
    </BlueButton>
  );
};
