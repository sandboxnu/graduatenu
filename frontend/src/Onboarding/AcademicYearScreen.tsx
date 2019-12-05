import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";

interface State {
  year: number;
}

class AcademicYearComponent extends React.Component<
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
      <GenericQuestionTemplate question="What is your academic year?">
        <FormControl>
          <InputLabel id="demo-simple-select-label">Academic Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.year}
            onChange={this.onChange.bind(this)}
          >
            <MenuItem value={1}>1st Year</MenuItem>
            <MenuItem value={2}>2nd Year</MenuItem>
            <MenuItem value={3}>3rd Year</MenuItem>
            <MenuItem value={4}>4th Year</MenuItem>
            <MenuItem value={5}>5th Year</MenuItem>
          </Select>
        </FormControl>
        <Link
          to={{
            pathname: "/graduationYear",
            state: {
              userData: {
                ...this.props.location.state.userData,
                academicYear: this.state.year,
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

export const AcademicYearScreen = withRouter(AcademicYearComponent);
