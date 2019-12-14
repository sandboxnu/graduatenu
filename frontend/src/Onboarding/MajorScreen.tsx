import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";
import { Autocomplete } from "@material-ui/lab";
import { majors } from "../majors";
import { Major, Schedule } from "../models/types";
import styled from "styled-components";
import { plans } from "../plans";
import { planToString } from "../utils";
import { connect } from "react-redux";
import { setMajorAction, setPlanStrAction } from "../state/actions/userActions";
import { Dispatch } from "redux";
import { setScheduleAction } from "../state/actions/scheduleActions";

const DropDownWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

interface MajorScreenProps {
  setMajor: (major?: Major) => void;
  setPlanStr: (planStr?: string) => void;
  setPlan: (plan: Schedule) => void;
}

interface MajorScreenState {
  major?: Major;
  planStr?: string;
}

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
    const maj = majors.find((m: any) => m.name === value);

    this.setState({ major: maj });
  }

  onChoosePlan(event: React.SyntheticEvent<{}>, value: any) {
    this.setState({ planStr: value });
  }

  onSubmit() {
    this.props.setMajor(this.state.major);
    this.props.setPlanStr(this.state.planStr);

    if (this.state.planStr) {
      const plan = plans[this.state.major!.name].find(
        (p: Schedule) => planToString(p) === this.state.planStr
      );

      this.props.setPlan(plan!);
    }
  }

  renderMajorDropDown() {
    return (
      <Autocomplete
        style={{ width: 300, marginRight: 18 }}
        disableListWrap
        options={majors.map(maj => maj.name)}
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

  renderPlansDropDown() {
    return (
      <Autocomplete
        style={{ width: 300 }}
        disableListWrap
        options={plans[this.state.major!.name].map(p => planToString(p))}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Plan"
            fullWidth
          />
        )}
        value={this.state.planStr || ""}
        onChange={this.onChoosePlan.bind(this)}
      />
    );
  }

  render() {
    return (
      <GenericQuestionTemplate question="What is your major?">
        <DropDownWrapper>
          {this.renderMajorDropDown()}
          {!!this.state.major && this.renderPlansDropDown()}
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setMajor: (major?: Major) => dispatch(setMajorAction(major)),
  setPlanStr: (planStr?: string) => dispatch(setPlanStrAction(planStr)),
  setPlan: (plan: Schedule) => dispatch(setScheduleAction(plan)),
});

export const MajorScreen = connect(
  null,
  mapDispatchToProps
)(withRouter(MajorComponent));
