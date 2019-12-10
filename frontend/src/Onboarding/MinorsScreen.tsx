import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";

interface State {
  minors: string[];
}

class MinorsComponent extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      minors: [],
    };
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const minors = e.target.value.split(", ");
    this.setState({
      minors: minors,
    });
  }

  render() {
    return (
      <GenericQuestionTemplate question="Any minors?">
        <TextField
          id="standard-basic"
          value={this.state.minors.join(", ")}
          onChange={this.onChange.bind(this)}
          placeholder="Business Administration, Marketing"
        />
        <Link
          to={{
            pathname: "/home",
            state: {
              userData: {
                ...this.props.location.state.userData,
                minors: this.state.minors,
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

export const MinorsScreen = withRouter(MinorsComponent);
