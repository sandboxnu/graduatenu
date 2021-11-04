import React from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { TextField, Tooltip } from "@material-ui/core";
import { GenericOnboardingTemplate } from "./GenericOnboarding";
import { NextButton } from "../components/common/NextButton";
import { connect } from "react-redux";
import styled from "styled-components";
import { Dispatch } from "redux";
import { Major, Schedule, ScheduleCourse } from "../../../common/types";
import {
  generateBlankCompletedCourseSchedule,
  generateBlankCompletedCourseScheduleNoCoopCycle,
  generateInitialSchedule,
  generateInitialScheduleNoCoopCycle,
} from "../utils";
import {
  setStudentGraduationYearAction,
  setStudentCoopCycleAction,
  setStudentMajorAction,
  setStudentCatalogYearAction,
  setStudentConcentrationAction,
  setStudentFullNameAction,
} from "../state/actions/studentActions";
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
  getUserIdFromState,
  getCompletedCoursesFromState,
  getAcademicYearFromState,
  getCompletedCourseCounterFromState,
  getCompletedCourseScheduleFromState,
} from "../state";
import { AppState } from "../state/reducers/state";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { findMajorFromName } from "../utils/plan-helpers";
import { SaveInParentConcentrationDropdown } from "../components/ConcentrationDropdown";
import { getAuthToken } from "../utils/auth-helpers";
import { updateUser } from "../services/UserService";
import { createPlanForUser, setPrimaryPlan } from "../services/PlanService";
import { addNewPlanAction } from "../state/actions/userPlansActions";
import { DNDSchedule, IPlanData, ITemplatePlan } from "../models/types";
import { DisclaimerPopup } from "../components/common/DisclaimerPopup";
import { BASE_FORMATTED_COOP_CYCLES } from "../plans/coopCycles";

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 700px;
`;

interface OnboardingReduxStoreProps {
  academicYear: number | null;
  major: string | null;
  majors: Major[];
  plans: Record<string, Schedule[]>;
  isFetchingMajors: boolean;
  isFetchingPlans: boolean;
  userId: number;
  completedCourses: ScheduleCourse[];
  completedCourseSchedule?: DNDSchedule;
  completedCourseCounter: number;
}

interface OnboardingReduxDispatchProps {
  setFullName: (fullName: string) => void;
  setGraduationYear: (graduationYear: number) => void;
  setCatalogYear: (catalogYear: number | null) => void;
  setMajor: (major: string | null) => void;
  setConcentration: (concentration: string | null) => void;
  setCoopCycle: (coopCycle: string | null) => void;
  addNewPlanAction: (
    plan: IPlanData | ITemplatePlan,
    academicYear?: number
  ) => void;
}

type OnboardingScreenProps = OnboardingReduxStoreProps &
  OnboardingReduxDispatchProps;

interface OnboardingScreenState {
  beenEditedYear: boolean;
  gradYear?: number;
  beenEditedGrad: boolean;
  major?: string;
  concentration?: string;
  coopCycle?: string;
  catalogYear?: number;
  hasNoConcentrationSelectedError: boolean;
  showErrors: boolean;
  open: boolean;
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
      gradYear: undefined,
      catalogYear: undefined,
      beenEditedYear: false,
      beenEditedGrad: false,
      hasNoConcentrationSelectedError: false,
      showErrors: false,
      major: props.major || undefined,
      concentration: undefined,
      coopCycle: undefined,
      open: true,
    };
  }

  hasMajorAndNoCatalogYearError() {
    return !this.state.catalogYear && !!this.state.major;
  }

  onChangeGradYear(e: any) {
    this.setState({
      gradYear: Number(e.target.value),
      beenEditedGrad: true,
      showErrors: false,
    });
  }

  onChangeCatalogYear(event: React.SyntheticEvent<{}>, value: any) {
    const newCatalogYear = Number(value);

    // if this.state.major exists, and the major exists with the selected catalog year, don't erase the major from the form
    const newMajor =
      this.state.major &&
      !!findMajorFromName(this.state.major, this.props.majors, newCatalogYear)
        ? this.state.major
        : undefined;

    this.setState({
      major: newMajor,
      concentration: undefined,
      coopCycle: undefined,
      catalogYear: newCatalogYear,
      showErrors: false,
    });
  }

  onChangeMajor(event: React.SyntheticEvent<{}>, value: any) {
    this.setState({
      major: value || undefined,
      coopCycle: undefined,
      concentration: undefined,
      showErrors: false,
    });
  }

  onChangeConcentration(value: any) {
    this.setState({
      concentration: value,
      showErrors: false,
    });
  }

  onChangePlan(event: React.SyntheticEvent<{}>, value: any) {
    this.setState({ coopCycle: value || undefined, showErrors: false });
  }

  /**
   * This function handles setting all of the properties once the next button has been pressed,
   * assuming all of the required fields have been filled out
   */
  onSubmit() {
    this.props.setGraduationYear(this.state.gradYear!);
    this.props.setCatalogYear(this.state.catalogYear || null);
    this.props.setMajor(this.state.major || null);
    this.props.setConcentration(this.state.concentration || null);
    this.props.setCoopCycle(this.state.coopCycle || null);

    this.updateUserAndCreatePlan();
  }

  updateUserAndCreatePlan() {
    const token = getAuthToken();
    const updateUserPromise = () =>
      updateUser(
        {
          id: this.props.userId!,
          token: token,
        },
        {
          major: this.state.major || null,
          graduation_year: this.state.gradYear!,
          coop_cycle: this.state.coopCycle || null,
          concentration: this.state.concentration || null,
          catalog_year: this.state.catalogYear || null,
        }
      );

    const createPlanPromise = () => {
      let schedule, courseCounter;
      if (!!this.state.coopCycle) {
        schedule = generateBlankCompletedCourseSchedule(
          this.props.academicYear!,
          this.state.gradYear!,
          this.props.completedCourseSchedule!,
          this.state.major!,
          this.state.coopCycle!,
          this.props.plans
        );
      } else {
        schedule = generateBlankCompletedCourseScheduleNoCoopCycle(
          this.props.academicYear!,
          this.state.gradYear!,
          this.props.completedCourseSchedule!
        );
      }

      createPlanForUser(this.props.userId!, {
        name: "Plan 1",
        link_sharing_enabled: false,
        schedule: schedule,
        major: this.state.major || null,
        coop_cycle: this.state.coopCycle || null,
        concentration: this.state.concentration || null,
        course_counter: this.props.completedCourseCounter || 0,
        catalog_year: this.state.catalogYear || null,
      }).then(response => {
        this.props.addNewPlanAction(response.plan, this.props.academicYear!);
        setPrimaryPlan(this.props.userId, response.plan.id);
      });
    };

    return Promise.all([updateUserPromise(), createPlanPromise()]);
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
   * Renders the grad year select component
   */
  renderGradYearSelect() {
    const error =
      this.state.showErrors &&
      !this.state.gradYear &&
      this.state.beenEditedGrad;

    return (
      <FormControl
        variant="outlined"
        error={error}
        style={{ marginBottom: marginSpace, minWidth: 326 }}
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
        <FormHelperText>{error && "Please select a valid year"}</FormHelperText>
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
        options={BASE_FORMATTED_COOP_CYCLES}
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

    const error: boolean =
      this.state.showErrors && this.hasMajorAndNoCatalogYearError();

    // show error if there is a major (given from khoury) and no catalog year is selected
    return (
      <FormControl
        variant="outlined"
        error={error}
        style={{ marginBottom: marginSpace, minWidth: 326 }}
      >
        <Tooltip
          title="Catalog Year refers to the year your major credits are associated to. This is usually the year you declared your Major."
          placement="top"
        >
          <Autocomplete
            disableListWrap
            options={majorSet}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label="Select a Catalog Year"
                fullWidth
                error={error}
              />
            )}
            value={!!this.state.catalogYear ? this.state.catalogYear + " " : ""}
            onChange={this.onChangeCatalogYear.bind(this)}
          />
        </Tooltip>
        <FormHelperText>
          {error && "Because you have a major, a catalog year is required"}
        </FormHelperText>
      </FormControl>
    );
  }

  renderConcentrationDropdown() {
    const major: Major | undefined = findMajorFromName(
      this.state.major,
      this.props.majors,
      this.state.catalogYear
    );

    const setError = (error: boolean) => {
      this.setState({ hasNoConcentrationSelectedError: error });
    };

    return (
      <SaveInParentConcentrationDropdown
        major={major}
        concentration={this.state.concentration || null}
        setConcentration={this.onChangeConcentration.bind(this)}
        style={{ width: 326, marginBottom: marginSpace }}
        useLabel={true}
        showError={this.state.showErrors}
        setError={setError}
      />
    );
  }
  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const { gradYear, major, catalogYear } = this.state;
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
      const allRequirementsFilled: boolean =
        !!gradYear && (!major || !!catalogYear);

      const majorSelectedAndNoConcentration =
        !!this.state.major && this.state.hasNoConcentrationSelectedError;

      const allFilledAndNoErrors =
        allRequirementsFilled &&
        !this.hasMajorAndNoCatalogYearError() &&
        !majorSelectedAndNoConcentration;

      const onClick = () => {
        if (this.hasMajorAndNoCatalogYearError()) {
          this.setState({
            beenEditedYear: true,
            beenEditedGrad: true,
            showErrors: true,
          });
        } else if (allFilledAndNoErrors) {
          this.onSubmit();
        } else {
          this.setState({
            showErrors: true,
          });
        }
      };

      // renders all of the different drop downs and for the next button, ensures that all
      // required fields are filled out before allowing it to move to the next screen
      return (
        <GenericOnboardingTemplate screen={0}>
          {this.renderGradYearSelect()}
          {this.renderCatalogYearDropDown()}
          {/* if there is a major given from khoury we want to show the major dropdown */}
          {this.renderMajorDropDown()}
          {this.renderConcentrationDropdown()}
          {this.renderCoopCycleDropDown()}
          {/* requires year, gradYear, and if there is a major, then there must be a catalog year */}
          {allFilledAndNoErrors ? (
            // Bypass completed courses screen to prevent overriding actual completed courses
            <Link
              to={{
                // pathname: !!major
                //   ? "/completedCourses"
                //   : "/transferableCredits",
                pathname: "/home",
              }}
              onClick={onClick}
              style={{ textDecoration: "none" }}
            >
              <NextButton />
            </Link>
          ) : (
            <div onClick={onClick}>
              <NextButton />
            </div>
          )}
          <DisclaimerPopup
            open={this.state.open}
            handleClose={this.handleClose.bind(this)}
          />
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
  setFullName: (fullName: string) =>
    dispatch(setStudentFullNameAction(fullName)),
  setGraduationYear: (gradYear: number) =>
    dispatch(setStudentGraduationYearAction(gradYear)),
  setMajor: (major: string | null) => dispatch(setStudentMajorAction(major)),
  setConcentration: (concentration: string | null) =>
    dispatch(setStudentConcentrationAction(concentration)),
  setCoopCycle: (coopCycle: string | null) =>
    dispatch(setStudentCoopCycleAction(coopCycle)),
  setCatalogYear: (catalogYear: number | null) =>
    dispatch(setStudentCatalogYearAction(catalogYear)),
  addNewPlanAction: (plan: IPlanData | ITemplatePlan, academicYear?: number) =>
    dispatch(addNewPlanAction(plan, academicYear)),
});

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapStateToProps = (state: AppState) => ({
  academicYear: getAcademicYearFromState(state),
  major: getUserMajorNameFromState(state),
  majors: getMajorsFromState(state),
  plans: getPlansFromState(state),
  isFetchingMajors: getMajorsLoadingFlagFromState(state),
  isFetchingPlans: getPlansLoadingFlagFromState(state),
  userId: getUserIdFromState(state),
  completedCourses: getCompletedCoursesFromState(state),
  completedCourseSchedule: getCompletedCourseScheduleFromState(state),
  completedCourseCounter: getCompletedCourseCounterFromState(state),
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
