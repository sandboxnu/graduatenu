import React from "react";
import {
  MenuItem,
  Menu,
  Button,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  getAcademicYearFromState,
  getActivePlanFromState,
  getUserIdFromState,
  getUserPlansFromState,
} from "../state";
import {
  deletePlan,
  setActivePlanAction,
} from "../state/actions/userPlansActions";
import { IPlanData } from "../models/types";
import Loader from "react-loader-spinner";
import { deletePlanForUser } from "../services/PlanService";
import { Alert } from "@material-ui/lab";

const SwitchPlanDropdown = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  width: 158px;
  height: auto;
`;
const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SwitchPlanMenu = styled(Menu)`
  margin-top: 45px;
  margin-left: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SelectPlanContainer = styled.div`
  justify-content: space-between;
  width: 100%;
  align-items: center;
  display: flex;
`;

const PlanText = styled.div`
  display: inline;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DropDownText = styled.div`
  display: inline;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  deletePlan: (name: string) => void;
}

type Props = ReduxStoreSwitchPlanProps & ReduxDispatchSwitchPlanProps;

interface SwitchPlanPopperState {
  anchorEl: null | HTMLElement;
  errorSnackbarOpen: boolean;
}

export class SwitchPlanPopperComponent extends React.Component<
  Props,
  SwitchPlanPopperState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
      errorSnackbarOpen: false,
    };
  }

  /**
   * Toggles opening the SwitchPlanPopper when the plan name is clicked.
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

  /**
   * Enables hiding the popper by clicking anywhere else on the screen.
   */
  handleClickAway() {
    this.setState({
      anchorEl: null,
    });
  }

  handleDelete(planId: number, name: string) {
    if (this.props.plans.length < 2) {
      this.setState({
        errorSnackbarOpen: true,
      });
    } else if (this.props.userId) {
      deletePlanForUser(this.props.userId, planId);
      this.props.deletePlan(name);
    }
  }

  handleCloseErrorSnackbar() {
    this.setState({
      errorSnackbarOpen: false,
    });
  }

  render() {
    return this.props.activePlan ? (
      <div>
        <SwitchPlanDropdown
          variant="outlined"
          onClick={event => this.handleClick(event)}
        >
          <SelectPlanContainer>
            <DropDownText>{"Switch Plan"}</DropDownText>
            <ButtonContainer>
              {Boolean(this.state.anchorEl) ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </ButtonContainer>
          </SelectPlanContainer>
        </SwitchPlanDropdown>
        <SwitchPlanMenu
          id={"simple-popper"}
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={() => this.handleClickAway()}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {this.props.plans.map(plan => (
            <MenuItem key={plan.name}>
              <SelectPlanContainer>
                <PlanText onClick={() => this.onChoosePlan(plan.name)}>
                  {plan.name}
                </PlanText>
                <ButtonContainer>
                  <IconButton
                    style={{ padding: "6px" }}
                    onClick={() => {
                      this.handleDelete(plan.id, plan.name);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ButtonContainer>
              </SelectPlanContainer>
            </MenuItem>
          ))}
        </SwitchPlanMenu>
        <Snackbar
          open={this.state.errorSnackbarOpen}
          onClose={this.handleCloseErrorSnackbar.bind(this)}
        >
          <Alert
            onClose={this.handleCloseErrorSnackbar.bind(this)}
            severity={"error"}
          >
            You must have at least one plan.
          </Alert>
        </Snackbar>
      </div>
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
  academicYear: getAcademicYearFromState(state)!,
  userId: getUserIdFromState(state)!,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setActivePlan: (activePlan: string, userId: number, academicYear: number) =>
    dispatch(setActivePlanAction(activePlan, userId, academicYear)),
  deletePlan: (name: string) => dispatch(deletePlan(name)),
});

export const SwitchPlanPopper = connect<
  ReduxStoreSwitchPlanProps,
  ReduxDispatchSwitchPlanProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(SwitchPlanPopperComponent);
