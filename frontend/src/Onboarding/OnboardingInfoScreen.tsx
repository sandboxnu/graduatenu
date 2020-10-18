import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { GenericOnboardingTemplate } from "./GenericOnboarding";
import { NextButton } from "../components/common/NextButton";
import { connect } from "react-redux";
import styled from "styled-components";
import { Dispatch } from "redux";
import { Major, Schedule } from "../../../common/types";
import { planToString } from "../utils";
import {
  setFullNameAction,
  setDeclaredMajorAction,
  setAcademicYearAction,
  setGraduationYearAction,
} from "../state/actions/userActions";
import { setCoopCycle } from "../state/actions/scheduleActions";
import Loader from "react-loader-spinner";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import {
  getMajors,
  getPlans,
  getMajorsLoadingFlag,
  getPlansLoadingFlag,
} from "../state";
import { AppState } from "../state/reducers/state";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { findMajorFromName } from "../utils/plan-helpers";

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 700px;
`;

interface NameScreenProps {
  setFullName: (fullName: string) => void;
}

interface AcademicYearScreenProps {
  setAcademicYear: (academicYear: number) => void;
}

interface GraduationYearScreenProps {
  setGraduationYear: (graduationYear: number) => void;
}

interface MajorScreenProps {
  setMajor: (major?: Major) => void;
  setCoopCycle: (plan: Schedule) => void;
  majors: Major[];
  plans: Record<string, Schedule[]>;
  isFetchingMajors: boolean;
  isFetchingPlans: boolean;
}

type OnboardingScreenProps = NameScreenProps &
  AcademicYearScreenProps &
  GraduationYearScreenProps &
  MajorScreenProps;

interface NameScreenState {
  textFieldStr: string;
  beenEditedName: boolean;
}

interface AcademicYearScreenState {
  year?: number;
  beenEditedYear: boolean;
}

interface GraduationYearScreenState {
  gradYear?: number;
  beenEditedGrad: boolean;
}

interface MajorScreenState {
  major?: Major;
  planStr?: string;
}

const marginSpace = 12;

type OnboardingScreenState = NameScreenState &
  AcademicYearScreenState &
  GraduationYearScreenState &
  MajorScreenState;

type Props = OnboardingScreenProps & RouteComponentProps;

class OnboardingScreenComponent extends React.Component<
  Props,
  OnboardingScreenState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      textFieldStr: "",
      year: undefined,
      gradYear: undefined,
      beenEditedName: false,
      beenEditedYear: false,
      beenEditedGrad: false,
      major: undefined,
      planStr: undefined,
    };
  }

  /**
   * All of the different functions that modify the properies of the screen as they are
   * changed
   */

  onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      textFieldStr: e.target.value,
      beenEditedName: true,
    });
  }

  onChangeYear(e: any) {
    this.setState({
      year: Number(e.target.value),
      beenEditedYear: true,
    });
  }

  onChangeGradYear(e: any) {
    this.setState({
      gradYear: e.target.value == 2020 ? Number(e.target.value) : 2020,
      beenEditedGrad: true,
    });
  }

  onChangeMajor(event: React.SyntheticEvent<{}>, value: any) {
    const maj = findMajorFromName(value, this.props.majors);

    this.setState({ major: maj, planStr: "" });
  }

  onChangePlan(event: React.SyntheticEvent<{}>, value: any) {
    this.setState({ planStr: value });
  }

  /**
   * This function handles setting all of the properties once the next button has been pressed,
   * assuming all of the required fields have been filled out
   */
  onSubmit() {
    this.props.setMajor(this.state.major);
    this.props.setFullName(this.state.textFieldStr);
    this.props.setAcademicYear(this.state.year!);
    this.props.setGraduationYear(this.state.gradYear!);

    if (this.state.planStr) {
      const plan = this.props.plans[this.state.major!.name].find(
        (p: Schedule) => planToString(p) === this.state.planStr
      );

      this.props.setCoopCycle(plan!);
    }
  }

  /**
   * Renders the major drop down
   */
  renderMajorDropDown() {
    return (
      <Autocomplete
        style={{ width: 326, marginBottom: marginSpace }}
        disableListWrap
        options={this.props.majors.map(maj => maj.name)}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Major"
            fullWidth
          />
        )}
        value={!!this.state.major ? this.state.major.name + " " : ""}
        onChange={this.onChangeMajor.bind(this)}
      />
    );
  }

  /**
   * Renders the name text field
   */
  renderNameTextField(textFieldStr: string, beenEditedName: boolean) {
    return (
      <TextField
        id="outlined-basic"
        label="Full Name"
        variant="outlined"
        value={textFieldStr}
        onChange={this.onChangeName.bind(this)}
        placeholder="John Smith"
        error={textFieldStr.length === 0 && beenEditedName}
        style={{ marginTop: 36, marginBottom: marginSpace, minWidth: 326 }}
        helperText={
          (" H " && (!beenEditedName || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEditedName &&
            "Please enter a valid name")
        }
      />
    );
  }

  /**
   * Renders the academic year select component
   */
  renderAcademicYearSelect(year: number | undefined, beenEditedYear: boolean) {
    return (
      <FormControl variant="outlined" error={!year && beenEditedYear}>
        <InputLabel
          id="demo-simple-select-outlined-label"
          style={{ marginBottom: marginSpace }}
        >
          Academic Year
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={year}
          onChange={this.onChangeYear.bind(this)}
          style={{ marginBottom: marginSpace, minWidth: 326 }}
          labelWidth={110}
        >
          <MenuItem value={1}>1st Year</MenuItem>
          <MenuItem value={2}>2nd Year</MenuItem>
          <MenuItem value={3}>3rd Year</MenuItem>
          <MenuItem value={4}>4th Year</MenuItem>
          <MenuItem value={5}>5th Year</MenuItem>
        </Select>
        <FormHelperText>
          {!year && beenEditedYear && "Please select a valid year\n"}
        </FormHelperText>
      </FormControl>
    );
  }

  /**
   * Renders the grad year select component
   */
  renderGradYearSelect(gradYear: number | undefined, beenEditedGrad: boolean) {
    return (
      <FormControl variant="outlined" error={!gradYear && beenEditedGrad}>
        <InputLabel
          id="demo-simple-select-outlined-label"
          style={{ marginBottom: marginSpace }}
        >
          Graduation Year
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={gradYear}
          onChange={this.onChangeGradYear.bind(this)}
          style={{ marginBottom: marginSpace, minWidth: 326 }}
          labelWidth={115}
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
          {!gradYear && beenEditedGrad && "Please select a valid year"}
        </FormHelperText>
      </FormControl>
    );
  }

  /**
   * Renders the coop cycle drop down
   */
  renderCoopCycleDropDown() {
    return (
      <Autocomplete
        style={{ width: 326, marginBottom: marginSpace }}
        disableListWrap
        options={this.props.plans[this.state.major!.name].map(p =>
          planToString(p)
        )}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Co-op Cycle"
            fullWidth
          />
        )}
        value={this.state.planStr || ""}
        onChange={this.onChangePlan.bind(this)}
      />
    );
  }

  render() {
    const {
      gradYear,
      year,
      textFieldStr,
      beenEditedName,
      beenEditedGrad,
      beenEditedYear,
    } = this.state;
    const { isFetchingMajors, isFetchingPlans } = this.props;

    if (isFetchingMajors || isFetchingPlans) {
      //render a spinnner if the majors/plans are still being fetched.
      return (
        <SpinnerWrapper>
          <Loader
            type="Puff"
            color="#f50057"
            height={100}
            width={100}
            timeout={5000} //5 secs
          />
        </SpinnerWrapper>
      );
    } else {
      // renders all of the different drop downs and for the next button, ensures that all
      // required fields are filled out before allowing it to move to the next screen
      return (
        <GenericOnboardingTemplate screen={0}>
          {this.renderNameTextField(textFieldStr, beenEditedName)}
          {this.renderAcademicYearSelect(year, beenEditedYear)}
          {this.renderGradYearSelect(gradYear, beenEditedGrad)}
          {this.renderMajorDropDown()}
          {!!this.state.major && this.renderCoopCycleDropDown()}

          {textFieldStr.length !== 0 && !!year && !!gradYear ? (
            <Link
              to={!!this.state.major ? "/completedCourses" : "/signup"}
              onClick={this.onSubmit.bind(this)}
              style={{ textDecoration: "none" }}
            >
              <NextButton />
            </Link>
          ) : (
            <div
              onClick={() =>
                this.setState({
                  beenEditedName: true,
                  beenEditedYear: true,
                  beenEditedGrad: true,
                })
              }
            >
              <NextButton />
            </div>
          )}
        </GenericOnboardingTemplate>
      );
    }
  }
}

/**
 * Callback to be passed into connect, to make properties of the AppState available as this components props.
 * @param state the AppState
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFullName: (fullName: string) => dispatch(setFullNameAction(fullName)),
  setAcademicYear: (academicYear: number) =>
    dispatch(setAcademicYearAction(academicYear)),
  setGraduationYear: (academicYear: number) =>
    dispatch(setGraduationYearAction(academicYear)),
  setMajor: (major?: Major) => dispatch(setDeclaredMajorAction(major)),
  setCoopCycle: (plan: Schedule) => dispatch(setCoopCycle(plan)),
});

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapStateToProps = (state: AppState) => ({
  majors: getMajors(state),
  plans: getPlans(state),
  isFetchingMajors: getMajorsLoadingFlag(state),
  isFetchingPlans: getPlansLoadingFlag(state),
});

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */
export const OnboardingInfoScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OnboardingScreenComponent));
