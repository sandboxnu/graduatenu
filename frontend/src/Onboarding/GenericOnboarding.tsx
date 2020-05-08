import React from "react";
import styled from "styled-components";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { red, green, blue, grey } from "@material-ui/core/colors";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;

const TitleLocation = styled.div`
  margin-top: 96px;
  width: 256;
  font-family: .Helvetica Neue DeskInterface;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const Box = styled.div`
  border: 1px solid white;
  width: 500px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const DotWrapper = styled.div`
  display: flex;
  width: 256;
  height: 11px;
  margin-top: 6px;
  margin-bottom: 34px;
`;

const useStyles = makeStyles({
  root: {
    height: 15,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#EB5757",
    },
  },
});

const steps = ["", ""];

interface Props {
  screen: number;
  children: any;
}

export const GenericOnboardingTemplate: React.FC<Props> = ({
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
              <Step key={label} style={{ color: red[400] }}>
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
