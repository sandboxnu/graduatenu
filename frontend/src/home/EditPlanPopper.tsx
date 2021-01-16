import React from "react";
import { Link } from "react-router-dom";
import Popper from "@material-ui/core/Popper";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Button, Tooltip } from "@material-ui/core";
import { EditPlanButton } from "./EditPlanButton";
import styled from "styled-components";
import { batch, connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import { DNDSchedule } from "../models/types";
import {
  getAcademicYearFromState,
  getActivePlanFromState,
  getGraduationYearFromState,
  getUserIdFromState,
  getUserPrimaryPlanIdFromState,
} from "../state";
import { IPlanData } from "../models/types";
import { Major, Schedule } from "../../../common/types";
import {
  getMajorsFromState,
  getPlansFromState,
  getTakenCreditsFromState,
  getUserFullNameFromState,
  getActivePlanCatalogYearFromState,
} from "../state";
import {
  alterScheduleToHaveCorrectYears,
  clearSchedule,
  generateInitialScheduleFromExistingPlan,
  getStandingFromCompletedCourses,
  planToString,
  scheduleHasClasses,
} from "../utils";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
  setActivePlanCoopCycleAction,
  setActivePlanMajorAction,
  setActivePlanDNDScheduleAction,
  setCurrentClassCounterForActivePlanAction,
  setActivePlanCatalogYearAction,
} from "../state/actions/userPlansActions";
import { setPrimaryPlan } from "../services/PlanService";
import {
  SnackbarAlert,
  ALERT_STATUS,
} from "../components/common/SnackbarAlert";

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

const ButtonContainer = styled.div`
  margin-top: 20px;
  height: 40px;
`;

const SetButton = styled(Button)<any>`
  background: #e0e0e0;
  font-weight: normal;
  float: right;
`;

interface ReduxStoreEditPlanProps {
  plan: IPlanData;
  majors: Major[];
  allPlans: Record<string, Schedule[]>;
  creditsTaken: number;
  name: string;
  userId: number;
  primaryPlanId?: number;
  catalogYear: number | null;
  academicYear: number;
  graduationYear: number;
}

interface ReduxDispatchEditPlanProps {
  setActivePlanCoopCycle: (
    coopCycle: string | null,
    academicYear: number,
    graduationYear: number,
    allPlans?: Record<string, Schedule[]>
  ) => void;
  setActivePlanDNDSchedule: (schedule: DNDSchedule) => void;
  setActivePlanMajor: (major: string | null) => void;
  setActivePlanCatalogYear: (number: number | null) => void;
  setCurrentClassCounter: (counter: number) => void;
}

type Props = ReduxStoreEditPlanProps & ReduxDispatchEditPlanProps;

interface EditPlanPopperState {
  anchorEl: null | HTMLElement;
  alertStatus: ALERT_STATUS;
}

export class EditPlanPopperComponent extends React.Component<
  Props,
  EditPlanPopperState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
      alertStatus: ALERT_STATUS.None,
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
    batch(() => {
      this.props.setActivePlanMajor(value);
      this.props.setActivePlanCoopCycle(
        "",
        this.props.academicYear,
        this.props.graduationYear
      );
    });
  }

  /**
   * Updates this user's plan based on the plan selected in the dropdown.
   */
  onChoosePlan(event: React.SyntheticEvent<{}>, value: any) {
    const chosenCoopCycle = value === "None" ? "" : value;
    this.props.setActivePlanCoopCycle(
      chosenCoopCycle,
      this.props.academicYear,
      this.props.graduationYear,
      this.props.allPlans
    );
  }

  onChangeCatalogYear(event: React.SyntheticEvent<{}>, value: any) {
    if (value === "") {
      this.props.setActivePlanCatalogYear(null);
    } else {
      this.props.setActivePlanCatalogYear(value);
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
            label="Major"
            fullWidth
          />
        )}
        value={this.props.plan.major}
        onChange={this.onChooseMajor.bind(this)}
        disabled={this.props.plan.isCurrentlyBeingEditedByAdvisor}
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
          ...this.props.allPlans[this.props.plan.major!].map(p =>
            planToString(p)
          ),
        ]}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Co-op Cycle"
            fullWidth
          />
        )}
        value={this.props.plan.coopCycle || "None"}
        onChange={this.onChoosePlan.bind(this)}
        disabled={this.props.plan.isCurrentlyBeingEditedByAdvisor}
      />
    );
  }

  renderCatalogYearDropdown() {
    let catalogYears = [
      ...Array.from(
        new Set(this.props.majors.map(maj => maj.yearVersion.toString()))
      ),
    ];
    return (
      <Autocomplete
        style={{ marginTop: "10px", marginBottom: "5px" }}
        disableListWrap
        options={catalogYears}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Catalog Year"
            fullWidth
          />
        )}
        value={
          this.props.plan.catalogYear ? this.props.plan.catalogYear + "" : ""
        }
        onChange={this.onChangeCatalogYear.bind(this)}
        disabled={this.props.plan.isCurrentlyBeingEditedByAdvisor}
      />
    );
  }

  renderSetClassesButton() {
    return (
      <ButtonContainer>
        <SetButton
          variant="contained"
          onClick={() => this.addClassesFromPOS()}
          disabled={this.props.plan.isCurrentlyBeingEditedByAdvisor}
        >
          Set Example Schedule
        </SetButton>
      </ButtonContainer>
    );
  }

  addClassesFromPOS() {
    const [schedule, counter] = generateInitialScheduleFromExistingPlan(
      this.props.academicYear,
      this.props.graduationYear,
      this.props.plan.major!,
      this.props.plan.coopCycle!,
      this.props.allPlans
    );
    batch(() => {
      this.props.setActivePlanDNDSchedule(schedule!);
      this.props.setCurrentClassCounter(counter);
    });
  }

  renderClearScheduleButton() {
    return (
      <ButtonContainer>
        <SetButton
          variant="contained"
          style={{ float: "right" }}
          onClick={() => this.onClearSchedule()}
          disabled={this.props.plan.isCurrentlyBeingEditedByAdvisor}
        >
          Clear Schedule
        </SetButton>
      </ButtonContainer>
    );
  }

  renderSetPrimaryPlan() {
    const isDisabled =
      this.props.primaryPlanId &&
      this.props.primaryPlanId === this.props.plan.id;
    return (
      <Tooltip
        title={
          isDisabled
            ? "This is already your primary plan"
            : "Indicate your primary plan of study for your advisor"
        }
      >
        <ButtonContainer>
          <SetButton
            variant="contained"
            style={{ float: "right" }}
            disabled={isDisabled}
            onClick={() =>
              setPrimaryPlan(this.props.userId, this.props.plan.id)
                .then(_ => {
                  this.setState({
                    alertStatus: ALERT_STATUS.Success,
                  });
                })
                .catch(_ => {
                  this.setState({
                    alertStatus: ALERT_STATUS.Error,
                  });
                })
            }
          >
            Set As Primary Plan
          </SetButton>
        </ButtonContainer>
      </Tooltip>
    );
  }

  onClearSchedule() {
    this.props.setActivePlanDNDSchedule(
      alterScheduleToHaveCorrectYears(
        clearSchedule(this.props.plan.schedule),
        this.props.academicYear,
        this.props.graduationYear
      )
    );
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
                <EditProfileButton to="/profile">
                  Edit Profile
                </EditProfileButton>
              </TopRow>
              <StandingText>
                {getStandingFromCompletedCourses(this.props.creditsTaken)}
              </StandingText>
              <StandingText>
                {this.props.creditsTaken + " Credits Completed"}
              </StandingText>
              {this.renderCatalogYearDropdown()}
              {!!this.props.plan.catalogYear && this.renderMajorDropDown()}
              {!!this.props.plan.major && this.renderPlansDropDown()}
              {!!this.props.plan.major &&
              !!this.props.plan.coopCycle &&
              !scheduleHasClasses(this.props.plan.schedule)
                ? this.renderSetClassesButton()
                : !!this.props.plan.major &&
                  !!this.props.plan.coopCycle &&
                  this.renderClearScheduleButton()}
              {!!this.props.plan.major &&
                !!this.props.plan.coopCycle &&
                this.props.plan.approvedSchedule &&
                this.renderSetPrimaryPlan()}
            </PlanCard>
          </ClickAwayListener>
        </PlanPopper>
        <SnackbarAlert
          alertStatus={this.state.alertStatus}
          handleClose={() => this.setState({ alertStatus: ALERT_STATUS.None })}
          successMsg="Set Primary Plan"
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  plan: getActivePlanFromState(state)!, // EditPlanPopper is only visible if there is an active plan
  majors: getMajorsFromState(state),
  allPlans: getPlansFromState(state),
  creditsTaken: getTakenCreditsFromState(state),
  name: getUserFullNameFromState(state),
  userId: getUserIdFromState(state),
  primaryPlanId: getUserPrimaryPlanIdFromState(state),
  catalogYear: getActivePlanCatalogYearFromState(state),
  academicYear: getAcademicYearFromState(state)!,
  graduationYear: getGraduationYearFromState(state)!,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setActivePlanCoopCycle: (
    coopCycle: string | null,
    academicYear: number,
    graduationYear: number,
    allPlans?: Record<string, Schedule[]>
  ) =>
    dispatch(
      setActivePlanCoopCycleAction(
        coopCycle,
        academicYear,
        graduationYear,
        allPlans
      )
    ),
  setActivePlanDNDSchedule: (schedule: DNDSchedule) =>
    dispatch(setActivePlanDNDScheduleAction(schedule)),
  setActivePlanMajor: (major: string | null) =>
    dispatch(setActivePlanMajorAction(major)),
  setActivePlanCatalogYear: (year: number | null) =>
    dispatch(setActivePlanCatalogYearAction(year)),
  setCurrentClassCounter: (counter: number) =>
    dispatch(setCurrentClassCounterForActivePlanAction(counter)),
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
