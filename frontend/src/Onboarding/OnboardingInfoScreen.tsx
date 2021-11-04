import { Form, Formik } from "formik";
import { MenuItem, TextField, Tooltip } from "@material-ui/core";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, useHistory, withRouter } from "react-router";
import { Dispatch } from "redux";
import * as Yup from "yup";
import styled from "styled-components";
import { IPlanData, ITemplatePlan, IUserData } from "../models/types";
import {
  setStudentAction,
  setStudentCatalogYearAction,
  setStudentConcentrationAction,
  setStudentCoopCycleAction,
  setStudentFullNameAction,
  setStudentGraduationYearAction,
  setStudentMajorAction,
} from "../state/actions/studentActions";
import { addNewPlanAction } from "../state/actions/userPlansActions";
import { GenericOnboardingTemplate } from "./GenericOnboarding";
import { getMajorsFromState, getUserMajorFromState } from "../state";
import { Major } from "../../../common/types";
import { AppState } from "../state/reducers/state";
import { Autocomplete } from "@material-ui/lab";
import { SaveInParentConcentrationDropdown } from "../components/ConcentrationDropdown";
import { BASE_FORMATTED_COOP_CYCLES } from "../plans/coopCycles";
import { NaNOrNumber, nullOrString } from "../utils/plan-helpers";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Title = styled.div`
  margin-top: 96px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const StyleForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const marginBottomSpace = 12;

interface OnboardingReduxDispatchProps {
  setStudentAction: (student: IUserData) => void;
  setFullName: (fullName: string) => void;
  setGraduationYear: (graduationYear: number) => void;
  setCatalogYear: (catalogYear: number | null) => void;
  setMajor: (major: string | null) => void;
  setConcentration: (concentration: string | null) => void;
  setCoopCycle: (coopCycle: string | null) => void;
}

interface OnboardingReduxStateProps {
  majors: Major[];
  major: Major;
}

type Props = OnboardingReduxDispatchProps &
  OnboardingReduxStateProps &
  RouteComponentProps<{}>;

const OnboardingScreenComponent: React.FC<Props> = ({
  majors,
  setStudentAction,
}) => {
  const history = useHistory();

  useEffect(() => {
    // if (majors.length === 0) {
    //   history.push('/redirect');
    // }
  });

  const catalogYearSet = [
    ...Array.from(new Set(majors.map(major => major.yearVersion.toString()))),
  ].sort();

  const majorNames = (catalogYear: string) => {
    return majors.filter(major => major.yearVersion === parseInt(catalogYear));
  };

  const getMajor = (
    majorName: string,
    catalogYear: string
  ): Major | undefined => {
    const majorResults = majors.filter(
      major =>
        major.name == majorName && major.yearVersion === parseInt(catalogYear)
    );

    return majorResults.length > 0 ? majorResults[0] : undefined;
  };

  const OnboardingFormValidation = Yup.object().shape({
    fullName: Yup.string()
      .max(255)
      .required("Required"),
    gradYear: Yup.string()
      .max(255)
      .nullable()
      .required("Required"),
    catalogYear: Yup.string()
      .max(255)
      .nullable(),
    major: Yup.string().when("catalogYear", {
      is: (value: string | any[]) => value == null,
      then: Yup.string().required("Please first select a catalog year."),
      otherwise: Yup.string().nullable(),
    }),
    concentration: Yup.string()
      .max(255)
      .nullable(),
    coopCycle: Yup.string()
      .max(255)
      .nullable(),
  });

  const handleSubmit = (values: {
    fullName: string;
    gradYear: string;
    catalogYear: string;
    major: string;
    concentration: string;
    coopCycle: string;
  }): void => {
    const user: IUserData = {
      id: 1123123,
      email: "",
      major: values.major,
      fullName: values.fullName,
      academicYear: null,
      graduationYear: NaNOrNumber(parseInt(values.gradYear)),
      catalogYear: NaNOrNumber(parseInt(values.catalogYear)),
      concentration: nullOrString(values.concentration),
      coopCycle: nullOrString(values.coopCycle),
      examCredits: [],
      transferCourses: [],
      completedCourses: [],
    };
    setStudentAction(user);
    history.push("/completedCourses");
  };

  return (
    <GenericOnboardingTemplate screen={0}>
      <Formik
        initialValues={{
          fullName: "",
          gradYear: "",
          catalogYear: "",
          major: "",
          concentration: "",
          coopCycle: "",
        }}
        validationSchema={OnboardingFormValidation}
        onSubmit={values => handleSubmit(values)}
      >
        {({
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
          setFieldValue,
          setTouched,
        }) => (
          <StyleForm>
            <TextField
              style={{ marginBottom: marginBottomSpace }}
              id="fullName"
              name="fullName"
              label="Full Name"
              variant="outlined"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullName && Boolean(errors.fullName)}
              helperText={
                errors.fullName && touched.fullName && errors.fullName
              }
            />
            <TextField
              style={{ marginBottom: marginBottomSpace }}
              id="gradYear"
              name="gradYear"
              select
              label="Graduation Year"
              variant="outlined"
              value={values.gradYear}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.gradYear && Boolean(errors.gradYear)}
              helperText={
                errors.gradYear && touched.gradYear && errors.gradYear
              }
            >
              {Array.from({ length: 5 }, (_, index) => index).map(count => {
                const currentYear: number = new Date().getFullYear();
                return (
                  <MenuItem
                    key={currentYear + count}
                    value={currentYear + count}
                  >
                    {currentYear + count}
                  </MenuItem>
                );
              })}
            </TextField>
            <Tooltip
              title="Catalog Year refers to the year your major credits are associated to. This is usually the year you declared your Major."
              placement="top"
            >
              <Autocomplete
                style={{ marginBottom: marginBottomSpace }}
                disableListWrap
                options={catalogYearSet}
                onChange={(_, value) => setFieldValue("catalogYear", value)}
                onBlur={() => setTouched({ ["catalogYear"]: true })}
                value={values.catalogYear}
                renderInput={params => (
                  <TextField
                    {...params}
                    id="catalogYear"
                    name="catalogYear"
                    label="Select a Catalog Year"
                    variant="outlined"
                    value={values.catalogYear}
                    error={touched.catalogYear && Boolean(errors.catalogYear)}
                    helperText={
                      errors.catalogYear &&
                      touched.catalogYear &&
                      errors.catalogYear
                    }
                  />
                )}
              />
            </Tooltip>
            <Autocomplete
              style={{ marginBottom: marginBottomSpace }}
              disableListWrap
              options={majorNames(values.catalogYear).map(maj => maj.name)}
              onChange={(_, value) => setFieldValue("major", value)}
              onBlur={() => setTouched({ ["major"]: true })}
              value={values.major}
              renderInput={params => (
                <TextField
                  {...params}
                  id="major"
                  name="major"
                  label="Select a Major"
                  variant="outlined"
                  value={values.major}
                  error={touched.major && Boolean(errors.major)}
                  helperText={errors.major && touched.major && errors.major}
                />
              )}
            />
            <SaveInParentConcentrationDropdown
              style={{ marginBottom: marginBottomSpace }}
              major={getMajor(values.major, values.catalogYear)}
              concentration={values.concentration}
              setConcentration={value => setFieldValue("concentration", value)}
              useLabel={true}
            />
            <Autocomplete
              style={{ marginBottom: marginBottomSpace }}
              disableListWrap
              options={BASE_FORMATTED_COOP_CYCLES}
              renderInput={params => (
                <TextField
                  {...params}
                  id="coopCycle"
                  name="coopCycle"
                  variant="outlined"
                  label="Select A Co-op Cycle"
                  fullWidth
                />
              )}
              value={values.coopCycle || ""}
              onChange={(_, value) => setFieldValue("coopCycle", value)}
              onBlur={() => setTouched({ ["coopCycle"]: true })}
            />
            <button type="submit">Submit</button>
          </StyleForm>
        )}
      </Formik>
    </GenericOnboardingTemplate>
  );
};

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapStateToProps = (state: AppState) => ({
  majors: getMajorsFromState(state),
});

/**
 * Callback to be passed into connect, to make properties of the AppState available as this components props.
 * @param state the AppState
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setStudentAction: (student: IUserData) => dispatch(setStudentAction(student)),
  setFullName: (fullName: string) =>
    dispatch(setStudentFullNameAction(fullName)),
  setMajor: (major: string | null) => dispatch(setStudentMajorAction(major)),
  setConcentration: (concentration: string | null) =>
    dispatch(setStudentConcentrationAction(concentration)),
  setGraduationYear: (gradYear: number) =>
    dispatch(setStudentGraduationYearAction(gradYear)),
  setCatalogYear: (catalogYear: number | null) =>
    dispatch(setStudentCatalogYearAction(catalogYear)),
  setCoopCycle: (coopCycle: string | null) =>
    dispatch(setStudentCoopCycleAction(coopCycle)),
  addNewPlanAction: (plan: IPlanData | ITemplatePlan, academicYear?: number) =>
    dispatch(addNewPlanAction(plan, academicYear)),
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
