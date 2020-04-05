import React, { useState } from "react";
import { MenuItem, Menu } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  getScheduleFromState,
  getPlanStrFromState,
  getMajorFromState,
} from "../state";
import {
  setScheduleAction,
  setCoopCycle,
} from "../state/actions/scheduleActions";
import { setMajorAction } from "../state/actions/userActions";
import { getMajors, getPlans } from "../state";
import { DNDSchedule, Major, Schedule } from "../models/types";

const SwitchPlanContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const SwitchPlanMenu = styled(Menu)`
  margin-top: 45px;
  margin-left: 20px;
`;

interface ReduxStoreEditPlanProps {
  schedule: DNDSchedule;
  major?: Major;
  planStr?: string;
  majors: Major[];
  plans: Record<string, Schedule[]>;
}

interface ReduxDispatchEditPlanProps {
  setCoopCycle: (schedule?: Schedule) => void;
  setSchedule: (schedule: Schedule) => void;
  setMajor: (major?: Major) => void;
}

type Props = ReduxStoreEditPlanProps & ReduxDispatchEditPlanProps;

// Plan dummy data
const plans = [
  {
    id: 1,
    name: "Primary Plan",
    value: "primary_plan",
  },
  {
    id: 2,
    name: "Secondary Plan",
    value: "secondary_plan",
  },
  {
    id: 3,
    name: "Tertiary Plan",
    value: "tertiary_plan",
  },
];

export const SwitchPlanPopperComponent = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [plan, setPlan] = useState("Primary Plan");

  /**
   * Toggles opening the SwitchPlanPopper when the plan name is clicked.
   * @param event mouse event trigger
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Updates this user's plan based on the plan selected in the dropdown.
   */
  const onChoosePlan = (value: string) => {
    setPlan(value);
    setAnchorEl(null);
  };

  /**
   * Enables hiding the popper by clicking anywhere else on the screen.
   */
  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <SwitchPlanContainer onClick={event => handleClick(event)}>
        <h2>{`- ${plan}`}</h2>
        {Boolean(anchorEl) ? (
          <KeyboardArrowUpIcon />
        ) : (
          <KeyboardArrowDownIcon />
        )}
      </SwitchPlanContainer>
      <SwitchPlanMenu
        id={"simple-popper"}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClickAway}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {plans.map(plan => (
          <MenuItem onClick={() => onChoosePlan(plan.name)} key={plan.value}>
            {plan.name}
          </MenuItem>
        ))}
      </SwitchPlanMenu>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
  planStr: getPlanStrFromState(state),
  major: getMajorFromState(state),
  majors: getMajors(state),
  plans: getPlans(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCoopCycle: (schedule?: Schedule) => dispatch(setCoopCycle(schedule)),
  setSchedule: (schedule: Schedule) => dispatch(setScheduleAction(schedule)),
  setMajor: (major?: Major) => dispatch(setMajorAction(major)),
});

export const SwitchPlanPopper = connect<
  ReduxStoreEditPlanProps,
  ReduxDispatchEditPlanProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(SwitchPlanPopperComponent);
