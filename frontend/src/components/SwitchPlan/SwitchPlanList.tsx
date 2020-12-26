import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../../state/reducers/state";
import { Dispatch } from "redux";
import {
  getActivePlanFromState,
  getUserPlansFromState,
  safelyGetAcademicYearFromState,
  safelyGetUserIdFromState,
} from "../../state";
import { setActivePlanAction } from "../../state/actions/userPlansActions";
import { IPlanData } from "../../models/types";
import Loader from "react-loader-spinner";

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SelectPlanContainer = styled.div`
  justify-content: space-between;
  width: 100%;
  align-items: center;
  display: flex;
  &:hover {
    background-color: #efefef;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const PlanText = styled.div`
  display: inline;
  overflow: hidden;
  font-family: Roboto;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 10px 0px;
  padding: 0px 6px 0px 6px;
`;

interface ReduxStoreSwitchPlanProps {
  activePlan: IPlanData;
  plans: IPlanData[];
  academicYear: number;
  userId: number;
}

interface ReduxDispatchSwitchPlanProps {
  setActivePlan: (
    activePlan: string,
    userId: number,
    academicYear: number
  ) => void;
}

type Props = ReduxStoreSwitchPlanProps & ReduxDispatchSwitchPlanProps;

export class SwitchPlanListComponent extends React.Component<Props> {
  /**
   * Updates this user's active schedule based on the schedule selected in the dropdown.
   */
  onChoosePlan(value: string) {
    const newPlan = this.props.plans.find(s => s.name === value);
    if (newPlan) {
      const newActive = newPlan.name;
      this.props.setActivePlan(
        newActive,
        this.props.userId,
        this.props.academicYear
      );
      this.setState({
        anchorEl: null,
      });
    }
  }

  render() {
    return this.props.activePlan ? (
      <>
        {this.props.plans.map(plan => (
          <SelectPlanContainer onClick={() => this.onChoosePlan(plan.name)}>
            <PlanText>{plan.name}</PlanText>
          </SelectPlanContainer>
        ))}
      </>
    ) : (
      <SpinnerWrapper>
        <Loader
          type="Puff"
          color="#f50057"
          height={100}
          width={100}
          timeout={5000} //5 secs
        />
      </SpinnerWrapper>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  plans: getUserPlansFromState(state),
  activePlan: getActivePlanFromState(state)!, // SwitchPlanPopper is only visible if there is an active plan
  academicYear: safelyGetAcademicYearFromState(state)!,
  userId: safelyGetUserIdFromState(state)!,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setActivePlan: (activePlan: string, userId: number, academicYear: number) =>
    dispatch(setActivePlanAction(activePlan, userId, academicYear)),
});

export const SwitchPlanList = connect<
  ReduxStoreSwitchPlanProps,
  ReduxDispatchSwitchPlanProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(SwitchPlanListComponent);
