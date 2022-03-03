import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IPlanData } from "../../models/types";
import {
  getActivePlanFromState,
  getIsUpdatingFromState,
  getUserIdFromState,
} from "../../state";
import {
  updateActivePlanAction,
  updateActivePlanFetchingAction,
} from "../../state/actions/userPlansActions";
import { WhiteColorButton } from "../common/ColoredButtons";
import { addYear } from "../../services/PlanService";
import { convertPlanToUpdatePlanData } from "../../utils/plan-helpers";

const AddYearButtonComponent = () => {
  const activePlan = useSelector(getActivePlanFromState);
  const userId = useSelector(getUserIdFromState);
  const isUpdating = useSelector(getIsUpdatingFromState);

  const dispatch = useDispatch();

  const updateActivePlan = (newPlan: Partial<IPlanData>) =>
    dispatch(updateActivePlanAction(newPlan));
  const updateActivePlanFetching = () =>
    dispatch(updateActivePlanFetchingAction());

  const handleNewSemester = async () => {
    updateActivePlanFetching();
    const res = await addYear(
      userId,
      activePlan.id,
      convertPlanToUpdatePlanData(activePlan, userId)
    );

    // Update store
    updateActivePlan(res.plan);
  };

  return (
    <WhiteColorButton
      variant="contained"
      style={{
        width: "100%",
        height: "36px",
        border: "1px solid #eb5757",
        marginBottom: "28px",
        boxShadow: "0 0 1px rgb(255 255 255 / 50%)",
        borderRadius: "0",
      }}
      disabled={isUpdating}
      onClick={handleNewSemester}
    >
      + Add Year
    </WhiteColorButton>
  );
};

export const AddYearButton = AddYearButtonComponent;
