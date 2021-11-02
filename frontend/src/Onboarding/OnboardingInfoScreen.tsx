import { VpnLockTwoTone } from "@material-ui/icons";
import { Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, useHistory, withRouter } from "react-router";
import { Dispatch } from "redux";
import * as Yup from "yup";
import styled from "styled-components";
import { IPlanData, ITemplatePlan } from "../models/types";
import {
  setStudentCatalogYearAction,
  setStudentConcentrationAction,
  setStudentCoopCycleAction,
  setStudentFullNameAction,
  setStudentGraduationYearAction,
  setStudentMajorAction,
} from "../state/actions/studentActions";
import { addNewPlanAction } from "../state/actions/userPlansActions";
import { AppState } from "../state/reducers/state";
import { GenericOnboardingTemplate } from "./GenericOnboarding";

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

interface OnboardingReduxDispatchProps {
  setFullName: (fullName: string) => void;
  setMajor: (major: string) => void;
  setConcentration: (concentration: string) => void;
  setGraduationYear: (gradYear: number) => void;
  setCatalogYear: (catalogYear: number) => void;
  setCoopCycle: (coopCycle: string) => void;
}

type Props = OnboardingReduxDispatchProps & RouteComponentProps<{}>;

const OnboardingValidation = Yup.object().shape({
  fullName: Yup.string()
    .max(255)
    .required("Full name is required"),
});

const OnboardingScreenComponent: React.FC<Props> = ({
  setFullName,
  setMajor,
  setConcentration,
  setGraduationYear,
  setCatalogYear,
  setCoopCycle,
}) => {
  const OnboardingForm: React.FC = () => {
    const history = useHistory();

    const handleSubmit = ({
      fullName,
      major,
      concentration,
      graduationYear,
      catalogYear,
      coopCycle,
    }: {
      fullName: string;
      major: string;
      concentration: string;
      graduationYear: number;
      catalogYear: number;
      coopCycle: string;
    }): void => {
      setFullName(fullName);
      setMajor(major);
      setConcentration(concentration);
      setGraduationYear(graduationYear);
      setCatalogYear(catalogYear);
      setCoopCycle(coopCycle);

      history.push("...?...");
    };

    return (
      <Formik
        initialValues={{
          fullName: "",
          major: "",
          concentration: "",
          graduationYear: 0,
          catalogYear: 0,
          coopCycle: "",
        }}
        validationSchema={OnboardingValidation}
        onSubmit={values => {
          handleSubmit({
            fullName: values.fullName,
            major: values.major,
            concentration: values.concentration,
            graduationYear: values.graduationYear,
            catalogYear: values.catalogYear,
            coopCycle: values.coopCycle,
          });
        }}
      ></Formik>
    );
  };

  return (
    <Wrapper>
      // How to use GenericOnboardingTemplate here?
      <Title>Let's get to know you!</Title>
      {<OnboardingForm />}
    </Wrapper>
  );
};

/**
 * Callback to be passed into connect, to make properties of the AppState available as this components props.
 * @param state the AppState
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
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
  null,
  mapDispatchToProps
)(withRouter(OnboardingScreenComponent));
