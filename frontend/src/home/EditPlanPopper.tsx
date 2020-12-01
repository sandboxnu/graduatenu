import React from "react";
import { Link } from "react-router-dom";
import Popper from "@material-ui/core/Popper";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Button } from "@material-ui/core";
import { EditPlanButton } from "./EditPlanButton";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  getScheduleFromState,
  getScheduleMajorFromState,
  getScheduleCoopCycleFromState,
} from "../state";
import {
  setScheduleAction,
  setCoopCycle,
  setScheduleMajor,
} from "../state/actions/scheduleActions";
import { DNDSchedule } from "../models/types";
import { Major, Schedule } from "../../../common/types";
import {
  getMajors,
  getPlans,
  getTakenCredits,
  getFullNameFromState,
} from "../state";
import { planToString, scheduleHasClasses } from "../utils";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { getStandingFromCompletedCourses } from "../utils";
import { findMajorFromName } from "../utils/plan-helpers";

const PlanPopper = styled(Popper)<any>`
  margin-top: 4px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditProfileButton = styled(Link)`
  font-size: 0.8em;
  color: #eb5757;
  &:focus,
  &:visited,
  &:link {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PlanCard = styled.div<any>`
  width: 266px;
  height: 247px;
  background: #ffffff;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.12),
    0px 0px 2px rgba(0, 0, 0, 0.14);
  padding: 16px;
`;

const NameText = styled.p`
  font-weight: 500;
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 5px;
`;

const StandingText = styled.p`
  font-weight: normal;
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 5px;
`;

const MajorTextField = styled(TextField)<any>`
  font-size: 10px;
`;

const SetButton = styled(Button)<any>`
  background: #e0e0e0;
  font-weight: normal;
`;

interface ReduxStoreEditPlanProps {
  schedule: DNDSchedule;
  major: string;
  planStr: string;
  majors: Major[];
  plans: Record<string, Schedule[]>;
  creditsTaken: number;
  name: string;
}

interface ReduxDispatchEditPlanProps {
  setCoopCycle: (coopCycle: string, schedule?: Schedule) => void;
  setSchedule: (schedule: Schedule) => void;
  setMajor: (major?: Major) => void;
}

type Props = ReduxStoreEditPlanProps & ReduxDispatchEditPlanProps;

interface EditPlanPopperState {
  anchorEl: null | HTMLElement;
}

export class EditPlanPopperComponent extends React.Component<
  Props,
  EditPlanPopperState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  /**
   * Toggles opening the EditPlanPopper when the edit button is clicked on.
   * @param event mouse event trigger
   */
  handleClick(event: React.MouseEvent<HTMLElement>) {
    if (this.state.anchorEl === null) {
      this.setState({
        anchorEl: event.currentTarget,
      });
    } else {
      this.setState({
        anchorEl: null,
      });
    }
  }

  /**
   * Updates this user's major based on the major selected in the dropdown.
   */
  onChooseMajor(event: React.SyntheticEvent<{}>, value: any) {
    const maj = findMajorFromName(value, this.props.majors);
    this.props.setMajor(maj);
    this.props.setCoopCycle("");
  }

  /**
   * Updates this user's plan based on the plan selected in the dropdown.
   */
  onChoosePlan(event: React.SyntheticEvent<{}>, value: any) {
    const plan = this.props.plans[this.props.major].find(
      (p: Schedule) => planToString(p) === value
    );

    if (plan) {
      const chosenCoopCycle = value === "None" ? "" : value;
      this.props.setCoopCycle(chosenCoopCycle, plan);
    }
  }

  renderMajorDropDown() {
    return (
      <Autocomplete
        style={{ marginTop: "10px", marginBottom: "5px" }}
        disableListWrap
        options={this.props.majors.map(maj => maj.name)}
        renderInput={params => (
          <MajorTextField
            {...params}
            variant="outlined"
            fullWidth
            size="small"
            margin="dense"
          />
        )}
        value={this.props.major}
        onChange={this.onChooseMajor.bind(this)}
      />
    );
  }

  renderPlansDropDown() {
    return (
      <Autocomplete
        style={{ marginBottom: "15px", fontSize: "10px" }}
        disableListWrap
        options={[
          "None",
          ...this.props.plans[this.props.major].map(p => planToString(p)),
        ]}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            size="small"
            margin="dense"
          />
        )}
        value={this.props.planStr || "None"}
        onChange={this.onChoosePlan.bind(this)}
      />
    );
  }

  renderSetClassesButton() {
    return (
      <SetButton
        variant="contained"
        style={{ float: "right" }}
        onClick={() => this.addClassesFromPOS()}
      >
        Set Example Schedule
      </SetButton>
    );
  }

  addClassesFromPOS() {
    const plan = this.props.plans[this.props.major].find(
      (p: Schedule) => planToString(p) === this.props.planStr!
    );
    this.props.setSchedule(plan!);
  }

  renderClearScheduleButton() {
    return (
      <SetButton
        variant="contained"
        style={{ float: "right" }}
        onClick={() => this.clearSchedule()}
      >
        Clear Schedule
      </SetButton>
    );
  }

  clearSchedule() {
    const plan = this.props.plans[this.props.major].find(
      (p: Schedule) => planToString(p) === this.props.planStr!
    );
    this.props.setCoopCycle(this.props.planStr || "", plan!);
  }

  /**
   * Enables hiding the popper by clicking anywhere else on the screen.
   */
  handleClickAway() {
    this.setState({
      anchorEl: null,
    });
  }

  render() {
    return (
      <div>
        <EditPlanButton onClick={this.handleClick.bind(this)} />
        <PlanPopper
          id={"simple-popper"}
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          placement="bottom-end"
        >
          <ClickAwayListener onClickAway={this.handleClickAway.bind(this)}>
            <PlanCard>
              <TopRow>
                <NameText>{this.props.name}</NameText>
                {/* <EditProfileButton to="/profile">
                  Edit Profile
                </EditProfileButton> */}
              </TopRow>
              <StandingText>
                {getStandingFromCompletedCourses(this.props.creditsTaken)}
              </StandingText>
              <StandingText>
                {this.props.creditsTaken + " Credits Completed"}
              </StandingText>
              {this.renderMajorDropDown()}
              {!!this.props.major && this.renderPlansDropDown()}
              {!!this.props.major &&
              !!this.props.planStr &&
              !scheduleHasClasses(this.props.schedule)
                ? this.renderSetClassesButton()
                : !!this.props.major &&
                  !!this.props.planStr &&
                  this.renderClearScheduleButton()}
            </PlanCard>
          </ClickAwayListener>
        </PlanPopper>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
  planStr: getScheduleCoopCycleFromState(state),
  major: getScheduleMajorFromState(state),
  majors: getMajors(state),
  plans: getPlans(state),
  creditsTaken: getTakenCredits(state),
  name: getFullNameFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCoopCycle: (coopCycle: string, schedule?: Schedule) =>
    dispatch(setCoopCycle(coopCycle, schedule)),
  setSchedule: (schedule: Schedule) => dispatch(setScheduleAction(schedule)),
  setMajor: (major?: Major) => dispatch(setScheduleMajor(major)),
});

export const EditPlanPopper = connect<
  ReduxStoreEditPlanProps,
  ReduxDispatchEditPlanProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(EditPlanPopperComponent);
