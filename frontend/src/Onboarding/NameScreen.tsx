import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";

interface State {
  textFieldStr: string;
  beenEdited: boolean;
}

class NameComponent extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      textFieldStr: "",
      beenEdited: false,
    };
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      textFieldStr: e.target.value,
      beenEdited: true,
    });
  }

  render() {
    const { textFieldStr, beenEdited } = this.state;
    return (
      <GenericQuestionTemplate question="What is your full name?">
        <TextField
          id="standard-basic"
          value={textFieldStr}
          onChange={this.onChange.bind(this)}
          placeholder="John Smith"
          error={textFieldStr.length === 0 && beenEdited}
          helperText={
            textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid name"
          }
        />
        {textFieldStr.length !== 0 ? (
          <Link
            to={{
              pathname: "/academicYear",
              state: { userData: { fullName: textFieldStr } },
            }}
            style={{ textDecoration: "none" }}
          >
            <NextButton />
          </Link>
        ) : (
          <div onClick={() => this.setState({ beenEdited: true })}>
            <NextButton />
          </div>
        )}
      </GenericQuestionTemplate>
    );
  }
}

export const NameScreen = withRouter(NameComponent);
