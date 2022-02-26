import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IPlanData } from "../../models/types";
import { getActivePlanFromState } from "../../state";
import { updateActivePlanAction } from "../../state/actions/userPlansActions";
import { AppState } from "../../state/reducers/state";
import { WhiteColorButton } from "../common/ColoredButtons";

type Props = ReduxStoreAddSemesterButtonProps &
  ReduxDispatchAddSemesterButtonProps;

interface ReduxStoreAddSemesterButtonProps {
  activePlan: IPlanData;
}

interface ReduxDispatchAddSemesterButtonProps {
  addSemester: (newPlan: Partial<IPlanData>) => void;
}

interface ServiceResponse {
  data: IPlanData;
}

const AddSemesterButtonComponent = (props: Props) => {
  // const handleNewSemester = () => {
  //   service.addNewSemester().then(({ data }: ServiceResponse) => {
  //     props.addSemester(data);
  //   })
  // }

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
      // onClick={handleNewSemester}
    >
      + Add Semester
    </WhiteColorButton>
  );
};

const mapStateToProps = (state: AppState) => ({
  activePlan: getActivePlanFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addSemester: (newPlan: Partial<IPlanData>) =>
    dispatch(updateActivePlanAction(newPlan)),
});

export const AddSemesterButton = connect<
  ReduxStoreAddSemesterButtonProps,
  ReduxDispatchAddSemesterButtonProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(AddSemesterButtonComponent);
