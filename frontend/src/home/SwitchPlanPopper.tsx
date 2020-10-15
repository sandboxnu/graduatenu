import React from "react";
import { MenuItem, Menu, Button, IconButton } from "@material-ui/core";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import { getSchedulesFromState, getActiveScheduleFromState } from "../state";
import { setActiveScheduleAction } from "../state/actions/schedulesActions";
import { setNamedSchedule } from "../state/actions/scheduleActions";
import { NamedSchedule } from "../models/types";
import Loader from "react-loader-spinner";

const SwitchPlanDropdown = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  width: 158px;
  height: 34px;
  padding: 0px 10px;
`;
const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60vh;
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
`;

const DropDownText = styled.div`
  display: inline;
  overflow: hidden;
`;

interface ReduxStoreSwitchSchedulesProps {
  activeSchedule: NamedSchedule;
  schedules: NamedSchedule[];
}

interface ReduxDispatchSwitchSchedulesProps {
  setActiveSchedule: (activeSchedule: number) => void;
  setNamedSchedule: (newSchedule: NamedSchedule) => void;
}

type Props = ReduxStoreSwitchSchedulesProps & ReduxDispatchSwitchSchedulesProps;

interface SwitchSchedulePopperState {
  anchorEl: null | HTMLElement;
}

export class SwitchPlanPopperComponent extends React.Component<
  Props,
  SwitchSchedulePopperState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
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
    const newSchedule = this.props.schedules.find(s => s.name === value);
    if (newSchedule) {
      const newActive = this.props.schedules.indexOf(newSchedule);
      this.props.setActiveSchedule(newActive);
      this.props.setNamedSchedule(newSchedule);
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

  render() {
    return this.props.activeSchedule ? (
      <div>
        <SwitchPlanDropdown
          variant="outlined"
          onClick={event => this.handleClick(event)}
        >
          <SelectPlanContainer>
            <DropDownText>{`${this.props.activeSchedule.name}`}</DropDownText>
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
          {this.props.schedules.map(s => (
            <MenuItem key={s.name}>
              <SelectPlanContainer>
                <PlanText onClick={() => this.onChoosePlan(s.name)}>
                  {" "}
                  {s.name}{" "}
                </PlanText>
                <ButtonContainer>
                  {" "}
                  <IconButton style={{ padding: "6px" }}>
                    <CreateIcon />
                  </IconButton>
                  <IconButton style={{ padding: "6px" }}>
                    <DeleteIcon />
                  </IconButton>
                </ButtonContainer>
              </SelectPlanContainer>
            </MenuItem>
          ))}
        </SwitchPlanMenu>
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
  schedules: getSchedulesFromState(state),
  activeSchedule: getActiveScheduleFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setActiveSchedule: (activeSchedule: number) =>
    dispatch(setActiveScheduleAction(activeSchedule)),
  setNamedSchedule: (newSchedule: NamedSchedule) =>
    dispatch(setNamedSchedule(newSchedule)),
});

export const SwitchPlanPopper = connect<
  ReduxStoreSwitchSchedulesProps,
  ReduxDispatchSwitchSchedulesProps,
  {},
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(SwitchPlanPopperComponent);
