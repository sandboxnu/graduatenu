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

const DropDownWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

interface State {
  major?: Major;
  plan?: Schedule;
}

class MajorComponent extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      major: undefined,
      plan: undefined,
    };
  }

  onChooseMajor(event: React.SyntheticEvent<{}>, value: any) {
    const maj = majors.find((m: any) => m.name === value);

    this.setState({ major: maj });
  }

  onChoosePlan(event: React.SyntheticEvent<{}>, value: any) {
    const plan = plans[this.state.major!.name].find(
      (p: Schedule) => planToString(p) === value
    );

    this.setState({ plan: plan });
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
        value={!!this.state.plan ? planToString(this.state.plan) + " " : ""}
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
            state: {
              userData: {
                ...this.props.location.state.userData,
                major: this.state.major,
                plan: this.state.plan,
              },
            },
          }}
          style={{ textDecoration: "none" }}
        >
          <NextButton />
        </Link>
      </GenericQuestionTemplate>
    );
  }
}

export const MajorScreen = withRouter(MajorComponent);
