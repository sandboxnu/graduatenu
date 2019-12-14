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
import { setGraduationYearAction } from "../state/actions/userActions";
import { Dispatch } from "redux";
import { connect } from "react-redux";

interface GraduationYearScreenProps {
  setGraduationYear: (graduationYear: number) => void;
}

interface GraduationYearScreenState {
  year?: number;
  beenEdited: boolean;
}

type Props = GraduationYearScreenProps & RouteComponentProps;

class GraduationYearComponent extends React.Component<
  Props,
  GraduationYearScreenState
> {
  constructor(props: Props) {
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
            }}
            onClick={() => this.props.setGraduationYear(this.state.year!)}
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setGraduationYear: (academicYear: number) =>
    dispatch(setGraduationYearAction(academicYear)),
});

export const GraduationYearScreen = connect(
  null,
  mapDispatchToProps
)(withRouter(GraduationYearComponent));
