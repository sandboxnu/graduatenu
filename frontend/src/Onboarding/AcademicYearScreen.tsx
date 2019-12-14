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
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setAcademicYearAction } from "../state/actions/userActions";

interface AcademicYearScreenProps {
  setAcademicYear: (academicYear: number) => void;
}

interface AcademicYearScreenState {
  year?: number;
  beenEdited: boolean;
}

type Props = AcademicYearScreenProps & RouteComponentProps;

class AcademicYearComponent extends React.Component<
  Props,
  AcademicYearScreenState
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
            }}
            onClick={() => this.props.setAcademicYear(this.state.year!)}
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
  setAcademicYear: (academicYear: number) =>
    dispatch(setAcademicYearAction(academicYear)),
});

export const AcademicYearScreen = connect(
  null,
  mapDispatchToProps
)(withRouter(AcademicYearComponent));
