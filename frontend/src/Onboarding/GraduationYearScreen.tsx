import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";

interface State {
  year: number;
}

class GraduationYearComponent extends React.Component<
  RouteComponentProps,
  State
> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      year: 0,
    };
  }

  onChange(e: any) {
    this.setState({
      year: Number(e.target.value),
    });
  }

  render() {
    return (
      <GenericQuestionTemplate question="What is your expected graduation year?">
        <TextField
          id="standard-basic"
          value={this.state.year}
          onChange={this.onChange.bind(this)}
          placeholder="2022"
        />
        <Link
          to={{
            pathname: "/major",
            state: {
              userData: {
                ...this.props.location.state.userData,
                graduationYear: this.state.year,
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

export const GraduationYearScreen = withRouter(GraduationYearComponent);
