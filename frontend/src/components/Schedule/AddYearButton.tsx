import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IPlanData } from "../../models/types";
import { getActivePlanFromState, getUserIdFromState } from "../../state";
import { updateActivePlanAction } from "../../state/actions/userPlansActions";
import { AppState } from "../../state/reducers/state";
import { WhiteColorButton } from "../common/ColoredButtons";
import { addYear } from "../../services/PlanService";
import { convertPlanToUpdatePlanData } from "../../utils/plan-helpers";

type Props = ReduxStoreAddYearButtonProps & ReduxDispatchAddYearButtonProps;

interface ReduxStoreAddYearButtonProps {
  activePlan: IPlanData;
  userId: number;
}

interface ReduxDispatchAddYearButtonProps {
  addYear: (newPlan: Partial<IPlanData>) => void;
}

const AddYearButtonComponent = ({ activePlan, userId }: Props) => {
  const handleNewSemester = async () => {
    const res = await addYear(
      userId,
      activePlan.id,
      convertPlanToUpdatePlanData(activePlan, userId)
    );
    // Update store
    updateActivePlanAction(res.plan);
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
      onClick={handleNewSemester}
    >
      + Add Year
    </WhiteColorButton>
  );
};

const mapStateToProps = (state: AppState) => ({
  activePlan: getActivePlanFromState(state),
  userId: getUserIdFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addYear: (newPlan: Partial<IPlanData>) =>
    dispatch(updateActivePlanAction(newPlan)),
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
