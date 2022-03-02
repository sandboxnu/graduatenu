import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
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
import { AppState } from "../../state/reducers/state";
import { WhiteColorButton } from "../common/ColoredButtons";
import { addYear } from "../../services/PlanService";
import { convertPlanToUpdatePlanData } from "../../utils/plan-helpers";
import { LoadingSpinner } from "../common/LoadingSpinner";

type Props = ReduxStoreAddYearButtonProps & ReduxDispatchAddYearButtonProps;

interface ReduxStoreAddYearButtonProps {
  activePlan: IPlanData;
  userId: number;
  isUpdating: boolean;
}

interface ReduxDispatchAddYearButtonProps {
  updateActivePlan: (newPlan: Partial<IPlanData>) => void;
  updateActivePlanFetching: () => void;
}

const AddYearButtonComponent = ({
  activePlan,
  userId,
  isUpdating,
  updateActivePlan,
  updateActivePlanFetching,
}: Props) => {
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

const mapStateToProps = (state: AppState) => ({
  activePlan: getActivePlanFromState(state),
  userId: getUserIdFromState(state),
  isUpdating: getIsUpdatingFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateActivePlan: (newPlan: Partial<IPlanData>) =>
    dispatch(updateActivePlanAction(newPlan)),
  updateActivePlanFetching: () => dispatch(updateActivePlanFetchingAction()),
});

export const AddYearButton = connect<
  ReduxStoreAddYearButtonProps,
  ReduxDispatchAddYearButtonProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(AddYearButtonComponent);
