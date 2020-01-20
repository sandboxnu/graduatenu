import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";
import { Autocomplete } from "@material-ui/lab";
import { Major, Schedule } from "../models/types";
import styled from "styled-components";
import { planToString } from "../utils";
import { connect } from "react-redux";
import { setMajorAction } from "../state/actions/userActions";
import { Dispatch } from "redux";
import { setCoopCycle } from "../state/actions/scheduleActions";
import { setScheduleAction } from "../state/actions/scheduleActions";
import {
  getMajors,
  getPlans,
  getMajorsLoadingFlag,
  getPlansLoadingFlag,
} from "../state";
import { AppState } from "../state/reducers/state";
import Loader from "react-loader-spinner";

const DropDownWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

interface MajorScreenProps {
  setMajor: (major?: Major) => void;
  setCoopCycle: (plan: Schedule) => void;
  setPlanStr: (planStr?: string) => void;
  setPlan: (plan: Schedule) => void;
  majors: Major[];
  plans: Record<string, Schedule[]>;
  isFetchingMajors: boolean;
  isFetchingPlans: boolean;
}

interface MajorScreenState {
  major?: Major;
  planStr?: string;
}

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 700px;
`;

type Props = MajorScreenProps & RouteComponentProps;

class MajorComponent extends React.Component<Props, MajorScreenState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      major: undefined,
      planStr: undefined,
    };
  }

  onChooseMajor(event: React.SyntheticEvent<{}>, value: any) {
    const maj = this.props.majors.find((m: any) => m.name === value);

    this.setState({ major: maj });
  }

  onChoosePlan(event: React.SyntheticEvent<{}>, value: any) {
    this.setState({ planStr: value });
  }

  onSubmit() {
    this.props.setMajor(this.state.major);

    if (this.state.planStr) {
      const plan = this.props.plans[this.state.major!.name].find(
        (p: Schedule) => planToString(p) === this.state.planStr
      );

      this.props.setCoopCycle(plan!);
    }
  }

  renderMajorDropDown() {
    return (
      <Autocomplete
        style={{ width: 300, marginRight: 18 }}
        disableListWrap
        options={this.props.majors.map(maj => maj.name)}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Major"
            fullWidth
          />
        )}
        value={!!this.state.major ? this.state.major.name + " " : ""}
        onChange={this.onChooseMajor.bind(this)}
      />
    );
  }

  renderCoopCycleDropDown() {
    return (
      <Autocomplete
        style={{ width: 300 }}
        disableListWrap
        options={this.props.plans[this.state.major!.name].map(p =>
          planToString(p)
        )}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Co-op Cycle"
            fullWidth
          />
        )}
        value={this.state.planStr || ""}
        onChange={this.onChoosePlan.bind(this)}
      />
    );
  }

  render() {
    const { isFetchingMajors, isFetchingPlans } = this.props;
    if (isFetchingMajors || isFetchingPlans) {
      return (
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
    } else {
      return (
        <GenericQuestionTemplate question="What is your major?">
          <DropDownWrapper>
            {this.renderMajorDropDown()}
            {!!this.state.major && this.renderCoopCycleDropDown()}
          </DropDownWrapper>
          <Link
            to={{
              pathname: "/home", // change to "/minors" to go to the minors screen
            }}
            onClick={this.onSubmit.bind(this)}
            style={{ textDecoration: "none" }}
          >
            <NextButton />
          </Link>
        </GenericQuestionTemplate>
      );
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  majors: getMajors(state),
  plans: getPlans(state),
  isFetchingMajors: getMajorsLoadingFlag(state),
  isFetchingPlans: getPlansLoadingFlag(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setMajor: (major?: Major) => dispatch(setMajorAction(major)),
  setCoopCycle: (plan: Schedule) => dispatch(setCoopCycle(plan)),
});

export const MajorScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MajorComponent));
