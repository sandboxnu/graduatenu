import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Button, Tooltip } from "@material-ui/core";
import { EditPlanButton } from "./EditPlanButton";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  getScheduleFromState,
  getPlanStrFromState,
  getMajorFromState,
  getCatalogYearFromState,
} from "../state";
import {
  setScheduleAction,
  setCoopCycle,
} from "../state/actions/scheduleActions";
import {
  setMajorAction,
  setCatalogYearAction,
} from "../state/actions/userActions";
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

const PlanPopper = styled(Popper)<any>`
  margin-top: 4px;
`;

const PlanCard = styled.div<any>`
  width: 266px;
  height: auto;
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
  major?: Major;
  planStr?: string;
  majors: Major[];
  plans: Record<string, Schedule[]>;
  creditsTaken: number;
  name: string;
  catalogYear?: number;
}

interface ReduxDispatchEditPlanProps {
  setCoopCycle: (schedule?: Schedule) => void;
  setSchedule: (schedule: Schedule) => void;
  setMajor: (major?: Major) => void;
  setCatalogYear: (number?: number) => void;
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
    const maj = this.props.majors.find((m: any) => m.name === value);
    this.props.setMajor(maj);
    this.props.setCoopCycle(undefined);
  }

  /**
   * Updates this user's plan based on the plan selected in the dropdown.
   */
  onChoosePlan(event: React.SyntheticEvent<{}>, value: any) {
    if (!value) {
      this.props.setCoopCycle(undefined);
      return;
    }

    const plan = this.props.plans[this.props.major!.name].find(
      (p: Schedule) => planToString(p) === value
    );

    if (plan) {
      this.props.setCoopCycle(plan);
    }
  }

  onChangeCatalogYear(event: React.SyntheticEvent<{}>, value: any) {
    this.props.setCatalogYear(value);
    this.props.setMajor(undefined);
    this.props.setCoopCycle(undefined);
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
            label="Major"
            fullWidth
          />
        )}
        value={!!this.props.major ? this.props.major.name + " " : ""}
        onChange={this.onChooseMajor.bind(this)}
      />
    );
  }

  renderPlansDropDown() {
    return (
      <Autocomplete
        style={{ marginBottom: "15px", fontSize: "10px" }}
        disableListWrap
        options={this.props.plans[this.props.major!.name].map(p =>
          planToString(p)
        )}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Co-op Cycle"
            fullWidth
          />
        )}
        value={this.props.planStr}
        onChange={this.onChoosePlan.bind(this)}
      />
    );
  }

  renderCatalogYearDropdown() {
    let majorSet = [
      ...Array.from(
        new Set(this.props.majors.map(maj => maj.yearVersion.toString()))
      ),
    ];
    const marginSpace = 12;
    return (
      <Autocomplete
        style={{ marginTop: "10px", marginBottom: "5px" }}
        disableListWrap
        options={majorSet}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Catalog Year"
            fullWidth
          />
        )}
        value={this.props.catalogYear || ""}
        onChange={this.onChangeCatalogYear.bind(this)}
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
    const plan = this.props.plans[this.props.major!.name].find(
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
    const plan = this.props.plans[this.props.major!.name].find(
      (p: Schedule) => planToString(p) === this.props.planStr!
    );
    this.props.setCoopCycle(plan!);
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
              <NameText>{this.props.name}</NameText>
              <StandingText>
                {getStandingFromCompletedCourses(this.props.creditsTaken)}
              </StandingText>
              <StandingText>
                {this.props.creditsTaken + " Credits Completed"}
              </StandingText>
              {this.renderCatalogYearDropdown()}
              {!!this.props.catalogYear && this.renderMajorDropDown()}
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
  planStr: getPlanStrFromState(state),
  major: getMajorFromState(state),
  majors: getMajors(state),
  plans: getPlans(state),
  creditsTaken: getTakenCredits(state),
  name: getFullNameFromState(state),
  //adding catalog year to appState? or to user
  catalogYear: getCatalogYearFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCoopCycle: (schedule?: Schedule) => dispatch(setCoopCycle(schedule)),
  setSchedule: (schedule: Schedule) => dispatch(setScheduleAction(schedule)),
  setMajor: (major?: Major) => dispatch(setMajorAction(major)),
  setCatalogYear: (catalogYear?: number) =>
    dispatch(setCatalogYearAction(catalogYear)),
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
