import { CopyIcon } from "@chakra-ui/icons";
import { API } from "@graduate/api-client";
import { CreatePlanDto, PlanModel } from "@graduate/common";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState, useContext } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import {
  USE_STUDENT_WITH_PLANS_SWR_KEY,
  useStudentWithPlans,
} from "../../hooks";
import {
  cleanDndIdsFromPlan,
  cleanDndIdsFromStudent,
  handleApiClientError,
} from "../../utils";
import { BlueButton } from "../Button";
import { IsGuestContext } from "../../pages/_app";

interface DuplicatePlanButton {
  plan: PlanModel<string>;
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
}

export const DuplicatePlanButton: React.FC<DuplicatePlanButton> = ({
  plan,
  setSelectedPlanId,
}) => {
  const router = useRouter();
  const { isGuest } = useContext(IsGuestContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { student } = useStudentWithPlans();

  const duplicatePlan = async () => {
    if (!student) return;
    // TODO: figure out when to do with this -- debounce stuff
    setButtonLoading(true);
    const updatedPlan: CreatePlanDto = {
      name: "Copy of " + plan.name,
      catalogYear: plan.catalogYear,
      major: plan.major,
      concentration: plan.concentration,
      schedule: cleanDndIdsFromPlan(plan).schedule,
    };

    let createdPlanId: number;
    if (isGuest) {
      // Create the duplicated plan in local storage
      createdPlanId = student.plans.length + 1;
      const planLocalStorage: PlanModel<null> = {
        ...updatedPlan,
        id: createdPlanId,
        student: cleanDndIdsFromStudent(student),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as PlanModel<null>;

      // TODO handle QuotaExceededError exception better
      try {
        window.localStorage.setItem(
          "student",
          JSON.stringify({
            ...student,
            plans: [...student.plans, planLocalStorage],
          })
        );
      } catch (error) {
        toast.error("Maximum local storage quota exceed. Too many plans.");
        return;
      }
    } else {
      try {
        const createdPlan = await API.plans.create(updatedPlan);
        createdPlanId = createdPlan.id;
      } catch (error) {
        handleApiClientError(error as Error, router);
        // don't proceed further if POST failed
        setButtonLoading(false);
        return;
      }
    }
    mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
    toast.success("Plan duplicated successfully");
    setSelectedPlanId(createdPlanId);
    setButtonLoading(false);
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
