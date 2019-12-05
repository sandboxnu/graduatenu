import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";
import { Autocomplete } from "@material-ui/lab";
import { majors } from "../majors";
import { Major } from "../models/types";

interface State {
  major?: Major;
}

class MajorComponent extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      major: undefined,
    };
  }

  onChooseMajor(event: React.SyntheticEvent<{}>, value: any) {
    const maj = majors.find((m: any) => m.name === value);

    this.setState({ major: maj });
  }

  renderMajorDropDown() {
    return (
      <Autocomplete
        style={{ width: 300 }}
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

  render() {
    return (
      <GenericQuestionTemplate question="What is your major?">
        {this.renderMajorDropDown()}
        <Link
          to={{
            pathname: "/minors",
            state: {
              userData: {
                ...this.props.location.state.userData,
                major: this.state.major,
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
