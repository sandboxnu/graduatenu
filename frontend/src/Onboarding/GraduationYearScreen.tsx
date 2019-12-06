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

class GraduationYearComponent extends React.Component<
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
      <GenericQuestionTemplate question="What is your expected graduation year?">
        <FormControl error={!year && beenEdited}>
          <InputLabel id="demo-simple-select-label">Academic Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={year}
            onChange={this.onChange.bind(this)}
          >
            <MenuItem value={2019}>2019</MenuItem>
            <MenuItem value={2020}>2020</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
          </Select>
          <FormHelperText>
            {!year && beenEdited && "Please select a valid year"}
          </FormHelperText>
        </FormControl>
        {!!year ? (
          <Link
            to={{
              pathname: "/major",
              state: {
                userData: {
                  ...this.props.location.state.userData,
                  graduationYear: year,
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

export const GraduationYearScreen = withRouter(GraduationYearComponent);
