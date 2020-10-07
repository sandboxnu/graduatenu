import { Checkbox, Grid, Paper } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { APExam, APExamGroup } from "../../../common/types";
import { NextButton } from "../components/common/NextButton";
import { setAPCredits } from "../state/actions/userActions";
import { GenericOnboardingTemplate } from "./GenericOnboarding";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { APExamGroups2020To2021 } from "../../../common/ap_exams";

// TODO factor out common stylings and structure with CompletedCoursesScreen

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

interface APExamGroupComponentProps {
  readonly apExamGroup: APExamGroup;
  readonly selectedAPExams: Array<APExam>;
  readonly setSelectedAPExams: (apExams: APExam[]) => void;
}

interface APExamComponentProps {
  readonly apExam: APExam;
  readonly selectedAPExams: Array<APExam>;
  readonly setSelectedAPExams: (apExams: APExam[]) => void;
}

const APExamComponent: React.FC<APExamComponentProps> = props => {
  const onChecked = (e: any): void => {
    const checked = e.target.checked;
    if (checked) {
      const newSelectedAPExams: Array<APExam> = props.selectedAPExams.filter(
        (apExam: APExam) => apExam.name === props.apExam.name
      );
      props.setSelectedAPExams(newSelectedAPExams);
    } else {
      const newSelectedAPExams: Array<APExam> = [
        ...props.selectedAPExams,
        props.apExam,
      ];
      props.setSelectedAPExams(newSelectedAPExams);
    }
  };

  return (
    <CourseWrapper>
      <Checkbox
        style={{ width: 2, height: 2 }}
        icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
        checkedIcon={
          <CheckBoxIcon style={{ fontSize: 20, color: "#EB5757" }} />
        }
        onChange={onChecked}
      />
      <CourseText>{props.apExam.name}</CourseText>
    </CourseWrapper>
  );
};

const APExamGroupComponent: React.FC<APExamGroupComponentProps> = props => {
  return (
    <div>
      <TitleText>{props.apExamGroup.name}</TitleText>
      {props.apExamGroup.apExams.map((apExam: APExam) => (
        <APExamComponent
          apExam={apExam}
          selectedAPExams={props.selectedAPExams}
          setSelectedAPExams={props.setSelectedAPExams}
        />
      ))}
    </div>
  );
};

const APCreditComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedAPExams, setSelectedAPExams] = useState<Array<APExam>>([]);

  const onSubmit = (): void => {
    dispatch(setAPCredits(selectedAPExams));
  };

  return (
    <GenericOnboardingTemplate screen={4}>
      <MainTitleText>Select any courses you took for AP credit:</MainTitleText>
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
        <Grid container justify="space-evenly">
          <Grid key={0} item>
            <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
              {APExamGroups2020To2021.map((apExamGroup: APExamGroup) => (
                <APExamGroupComponent
                  apExamGroup={apExamGroup}
                  selectedAPExams={selectedAPExams}
                  setSelectedAPExams={setSelectedAPExams}
                />
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Link
        to={"/signup"} // TODO create a set flow that can easily be fetched based upon the current page
        onSubmit={onSubmit}
        style={{ textDecoration: "none" }}
      >
        <NextButton />
      </Link>
    </GenericOnboardingTemplate>
  );
};

export default APCreditComponent;
