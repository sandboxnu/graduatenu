import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import { GenericQuestionTemplate } from "./GenericQuestionScreen";
import { NextButton } from "../components/common/NextButton";

interface State {
  year?: number;
  beenEdited: boolean;
}

class AcademicYearComponent extends React.Component<
  RouteComponentProps,
  State
> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      year: undefined,
      beenEdited: false,
    };
  }

  onChange(e: any) {
    this.setState({
      year: Number(e.target.value),
      beenEdited: true,
    });
  }

  render() {
    const { year, beenEdited } = this.state;
    return (
      <GenericQuestionTemplate question="What is your academic year?">
        <FormControl error={!year && beenEdited}>
          <InputLabel id="demo-simple-select-label">Academic Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={year}
            onChange={this.onChange.bind(this)}
          >
            <MenuItem value={1}>1st Year</MenuItem>
            <MenuItem value={2}>2nd Year</MenuItem>
            <MenuItem value={3}>3rd Year</MenuItem>
            <MenuItem value={4}>4th Year</MenuItem>
            <MenuItem value={5}>5th Year</MenuItem>
          </Select>
          <FormHelperText>
            {!year && beenEdited && "Please select a valid year"}
          </FormHelperText>
        </FormControl>
        {!!year ? (
          <Link
            to={{
              pathname: "/graduationYear",
              state: {
                userData: {
                  ...this.props.location.state.userData,
                  academicYear: year,
                },
              },
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

export const AcademicYearScreen = withRouter(AcademicYearComponent);
