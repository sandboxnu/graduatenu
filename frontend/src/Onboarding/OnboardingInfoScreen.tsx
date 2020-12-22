import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField, Tooltip } from "@material-ui/core";
import { GenericOnboardingTemplate } from "./GenericOnboarding";
import { NextButton } from "../components/common/NextButton";
import { connect } from "react-redux";
import styled from "styled-components";
import { Dispatch } from "redux";
import { Major, Schedule } from "../../../common/types";
import { planToString } from "../utils";
import {
  setAcademicYearAction,
  setGraduationYearAction,
  setUserCoopCycleAction,
  setUserMajorAction,
  setUserCatalogYearAction,
} from "../state/actions/userActions";
import Loader from "react-loader-spinner";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import {
  getMajorsFromState,
  getPlansFromState,
  getMajorsLoadingFlagFromState,
  getPlansLoadingFlagFromState,
  getUserMajorNameFromState,
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

interface OnboardingReduxStoreProps {
  major: string | null;
  majors: Major[];
  plans: Record<string, Schedule[]>;
  isFetchingMajors: boolean;
  isFetchingPlans: boolean;
}

interface OnboardingReduxDispatchProps {
  setAcademicYear: (academicYear: number) => void;
  setGraduationYear: (graduationYear: number) => void;
  setCatalogYear: (catalogYear: number | null) => void;
  setMajor: (major: string | null) => void;
  setCoopCycle: (coopCycle: string | null) => void;
}

type OnboardingScreenProps = OnboardingReduxStoreProps &
  OnboardingReduxDispatchProps;

interface OnboardingScreenState {
  year?: number;
  beenEditedYear: boolean;
  gradYear?: number;
  beenEditedGrad: boolean;
  major?: string;
  coopCycle?: string;
  catalogYear?: number;
  showNeedsCatalogYearIfMajorError: boolean;
}

const marginSpace = 12;

type Props = OnboardingScreenProps & RouteComponentProps;

class OnboardingScreenComponent extends React.Component<
  Props,
  OnboardingScreenState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      year: undefined,
      gradYear: undefined,
      catalogYear: undefined,
      beenEditedYear: false,
      beenEditedGrad: false,
      showNeedsCatalogYearIfMajorError: false,
      major: props.major || undefined,
      coopCycle: undefined,
    };
  }

  /**
   * All of the different functions that modify the properies of the screen as they are
   * changed
   */
  onChangeYear(e: any) {
    this.setState({
      year: Number(e.target.value),
      beenEditedYear: true,
    });
  }

  onChangeGradYear(e: any) {
    this.setState({
      gradYear: Number(e.target.value),
      beenEditedGrad: true,
    });
  }

  onChangeCatalogYear(event: React.SyntheticEvent<{}>, value: any) {
    const newCatalogYear = Number(value);

    // if this.state.major exists, and the major exists with the selected catalog year, don't erase the major from the form
    const newMajor =
      this.state.major &&
      findMajorFromName(this.state.major, this.props.majors)?.yearVersion ===
        newCatalogYear
        ? this.state.major
        : undefined;

    this.setState({
      major: newMajor,
      coopCycle: undefined,
      catalogYear: newCatalogYear,
      showNeedsCatalogYearIfMajorError: true,
    });
  }

  onChangeMajor(event: React.SyntheticEvent<{}>, value: any) {
    this.setState({ major: value || undefined, coopCycle: undefined });
  }

  onChangePlan(event: React.SyntheticEvent<{}>, value: any) {
    this.setState({ coopCycle: value || undefined });
  }

  /**
   * This function handles setting all of the properties once the next button has been pressed,
   * assuming all of the required fields have been filled out
   */
  onSubmit() {
    this.props.setAcademicYear(this.state.year!);
    this.props.setGraduationYear(this.state.gradYear!);
    this.props.setCatalogYear(this.state.catalogYear || null);
    this.props.setMajor(this.state.major || null);
    this.props.setCoopCycle(this.state.coopCycle || null);
  }

  /**
   * Renders the major drop down
   */
  renderMajorDropDown() {
    let majorNames = this.props.majors.filter(
      major => major.yearVersion === this.state.catalogYear
    ); //takes in a major object return t if you want to keep it (only when catalog)
    return (
      <Autocomplete
        style={{ width: 326, marginBottom: marginSpace }}
        disableListWrap
        options={majorNames.map(maj => maj.name)} //need to filter for only current catalog year
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Major"
            fullWidth
          />
        )}
        value={!!this.state.major ? this.state.major + " " : ""}
        onChange={this.onChangeMajor.bind(this)}
      />
    );
  }

  /**
   * Renders the academic year select component
   */
  renderAcademicYearSelect() {
    return (
      <FormControl
        variant="outlined"
        error={!this.state.year && this.state.beenEditedYear}
      >
        <InputLabel
          id="demo-simple-select-outlined-label"
          style={{ marginBottom: marginSpace }}
        >
          Academic Year
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={this.state.year}
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
          {!this.state.year &&
            this.state.beenEditedYear &&
            "Please select a valid year\n"}
        </FormHelperText>
      </FormControl>
    );
  }

  /**
   * Renders the grad year select component
   */
  renderGradYearSelect() {
    return (
      <FormControl
        variant="outlined"
        error={!this.state.gradYear && this.state.beenEditedGrad}
      >
        <InputLabel
          id="demo-simple-select-outlined-label"
          style={{ marginBottom: marginSpace }}
        >
          Graduation Year
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={this.state.gradYear}
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
          {!this.state.gradYear &&
            this.state.beenEditedGrad &&
            "Please select a valid year"}
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
        options={this.props.plans[this.state.major!].map(p => planToString(p))}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Co-op Cycle"
            fullWidth
          />
        )}
        value={this.state.coopCycle || ""}
        onChange={this.onChangePlan.bind(this)}
      />
    );
  }

  /**
   * Renders the catalog drop down
   */
  renderCatalogYearDropDown() {
    //need to make chanegs to options to filter out repeat catalog years
    let majorSet = [
      ...Array.from(
        new Set(this.props.majors.map(maj => maj.yearVersion.toString()))
      ),
    ];
    // show error if there is a major (given from khoury) and no catalog year is selected
    return (
      <FormControl
        variant="outlined"
        error={
          !this.state.catalogYear &&
          !!this.state.major &&
          this.state.showNeedsCatalogYearIfMajorError
        }
      >
        <Tooltip
          title="Catalog Year refers to the year your major credits are associated to. This is usually the year you declared your Major."
          placement="top"
        >
          <Autocomplete
            style={{ width: 326, marginBottom: marginSpace }}
            disableListWrap
            options={majorSet}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label="Select a Catalog Year"
                fullWidth
              />
            )}
            value={!!this.state.catalogYear ? this.state.catalogYear + " " : ""}
            onChange={this.onChangeCatalogYear.bind(this)}
          />
        </Tooltip>
        <FormHelperText>
          {!this.state.catalogYear &&
            !!this.state.major &&
            this.state.showNeedsCatalogYearIfMajorError &&
            "Because you have a major, a catalog year is required"}
        </FormHelperText>
      </FormControl>
    );
  }

  render() {
    const { gradYear, year, major, catalogYear } = this.state;
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
          {this.renderAcademicYearSelect()}
          {this.renderGradYearSelect()}
          {this.renderCatalogYearDropDown()}
          {/* if there is a major given from khoury we want to show the major dropdown */}
          {(!!catalogYear || !!major) && this.renderMajorDropDown()}
          {!!catalogYear && !!major && this.renderCoopCycleDropDown()}
          {/* requires year, gradYear, and if there is a major, then there must be a catalog year */}
          {!!year && !!gradYear && (!major || !!catalogYear) ? (
            <Link
              to={{
                pathname: !!major
                  ? "/completedCourses"
                  : "/transferableCredits",
              }}
              onClick={this.onSubmit.bind(this)}
              style={{ textDecoration: "none" }}
            >
              <NextButton />
            </Link>
          ) : (
            <div
              onClick={() =>
                this.setState({
                  beenEditedYear: true,
                  beenEditedGrad: true,
                  showNeedsCatalogYearIfMajorError: true,
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
  setAcademicYear: (academicYear: number) =>
    dispatch(setAcademicYearAction(academicYear)),
  setGraduationYear: (academicYear: number) =>
    dispatch(setGraduationYearAction(academicYear)),
  setMajor: (major: string | null) => dispatch(setUserMajorAction(major)),
  setCoopCycle: (coopCycle: string | null) =>
    dispatch(setUserCoopCycleAction(coopCycle)),
  setCatalogYear: (catalogYear: number | null) =>
    dispatch(setUserCatalogYearAction(catalogYear)),
});

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapStateToProps = (state: AppState) => ({
  major: getUserMajorNameFromState(state),
  majors: getMajorsFromState(state),
  plans: getPlansFromState(state),
  isFetchingMajors: getMajorsLoadingFlagFromState(state),
  isFetchingPlans: getPlansLoadingFlagFromState(state),
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
