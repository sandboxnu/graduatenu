import React from "react";
import styled from "styled-components";
import { red } from "@material-ui/core/colors";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, Paper } from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { NextButton } from "../components/common/NextButton";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;

const TitleLocation = styled.div`
  margin-top: 96px;
  margin-bottom: 48px;
  width: 256px;
  font-family: .Helvetica Neue DeskInterface, serif;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const Box = styled.div`
  width: 500px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const DotWrapper = styled.div`
  display: flex;
  height: 11px;
  margin-top: 6px;
  margin-bottom: 48px;
`;

const MainTitleText = styled.div`
  font-size: 16px;
  margin-left: 4px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
`;

const TitleText = styled.div`
  font-size: 12px;
  margin-left: 4px;
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 500;
`;

const CourseWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CourseText = styled.p`
  font-size: 12px;
  margin: 1px;
  font-weight: 400;
`;

const ScrollWrapper = styled.div`
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  &::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    background-color: #c1c1c1;
    border-color: transparent;
    border-radius: 9px 8px 8px 9px;
    border-style: solid;
    border-width: 3px 3px 3px 4px;
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 16px;
  }

  &::-webkit-scrollbar-track:vertical {
    border-left: 1px solid #e7e7e7;
    box-shadow: 1px 0 1px 0 #f6f6f6 inset, -1px 0 1px 0 #f6f6f6 inset;
  }
`;

const useStyles = makeStyles({
  root: {
    height: 15,
    paddingLeft: 8,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#EB5757",
    },
  },
});

const steps = [
  "Student Profile",
  "Completed Courses",
  "Transfer Courses",
  "AP/IB Courses",
];

interface SelectableCourseProps {
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly courseText: string;
  readonly checked: boolean;
}

interface GenericOnboardingTemplateProps {
  screen: number;
  children: any;
}

interface OnboardingSelectionTemplateProps {
  readonly screen: number;
  readonly mainTitleText: string;
  readonly onSubmit: () => Promise<void>;
  readonly to: string;
}

const SelectableCourse: React.FC<SelectableCourseProps> = ({
  courseText,
  onChange,
  checked,
}) => {
  return (
    <CourseWrapper>
      <Checkbox
        checked={checked}
        style={{ width: 2, height: 2 }}
        icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
        checkedIcon={
          <CheckBoxIcon style={{ fontSize: 20, color: "#EB5757" }} />
        }
        onChange={onChange}
      />
      <CourseText>{courseText}</CourseText>
    </CourseWrapper>
  );
};

const GenericOnboardingTemplate: React.FC<GenericOnboardingTemplateProps> = ({
  screen,
  children,
}) => {
  const classes = useStyles();
  return (
    <Wrapper>
      <TitleLocation>Let's get to know you!</TitleLocation>

      <ThemeProvider theme={theme}>
        <DotWrapper>
          <Stepper activeStep={screen} style={{ minWidth: 300 }}>
            {steps.map(label => (
              <Step key={label} style={{ color: red[400], padding: 0 }}>
                <StepLabel StepIconProps={{ classes: { root: classes.root } }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </DotWrapper>
      </ThemeProvider>
      <Box>{children}</Box>
    </Wrapper>
  );
};

const OnboardingSelectionTemplateComponent: React.FC<OnboardingSelectionTemplateProps &
  RouteComponentProps> = ({
  screen,
  mainTitleText,
  onSubmit,
  to,
  history,
  children,
}) => {
  return (
    <GenericOnboardingTemplate screen={screen}>
      <MainTitleText>{mainTitleText}</MainTitleText>
      <Paper
        elevation={0}
        style={{
          minWidth: 800,
          maxWidth: 800,
          minHeight: 300,
          maxHeight: 300,
          overflow: "-moz-scrollbars-vertical",
          overflowY: "scroll",
        }}
        component={ScrollWrapper}
      >
        {children}
      </Paper>
      <div
        onClick={() => {
          onSubmit().then(() => {
            history.push(to);
          });
        }}
        style={{ textDecoration: "none" }}
      >
        <NextButton />
      </div>
    </GenericOnboardingTemplate>
  );
};

const OnboardingSelectionTemplate = withRouter(
  OnboardingSelectionTemplateComponent
);

export {
  CourseText,
  GenericOnboardingTemplate,
  OnboardingSelectionTemplate,
  MainTitleText,
  TitleText,
  ScrollWrapper,
  SelectableCourse,
};
