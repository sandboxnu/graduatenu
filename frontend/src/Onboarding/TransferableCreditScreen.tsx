import { Checkbox, Grid, Paper } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { TransferableExam, TransferableExamGroup } from "../../../common/types";
import { NextButton } from "../components/common/NextButton";
import { setExamCredits } from "../state/actions/userActions";
import { GenericOnboardingTemplate } from "./GenericOnboarding";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { APExamGroups2020To2021 } from "../../../common/ap_exams";
import { IBExamGroups2020To2021 } from "../../../common/ib_exams";

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

interface TransferableExamGroupComponentProps {
  readonly transferableExamGroup: TransferableExamGroup;
  readonly selectedTransferableExams: Array<TransferableExam>;
  readonly setSelectedTransferableExams: (
    transferableExams: TransferableExam[]
  ) => void;
}

interface TransferableExamComponentProps {
  readonly transferableExam: TransferableExam;
  readonly selectedTransferableExams: Array<TransferableExam>;
  readonly setSelectedTransferableExams: (
    transferableExams: TransferableExam[]
  ) => void;
}

const TransferableExamComponent: React.FC<
  TransferableExamComponentProps
> = props => {
  const onChecked = (e: any): void => {
    const checked = e.target.checked;
    if (checked) {
      const newSelectedTransferableExams: Array<TransferableExam> = [
        ...props.selectedTransferableExams,
        props.transferableExam,
      ];
      props.setSelectedTransferableExams(newSelectedTransferableExams);
    } else {
      const newSelectedTransferableExams: Array<
        TransferableExam
      > = props.selectedTransferableExams.filter(
        (transferableExam: TransferableExam) =>
          transferableExam.name !== props.transferableExam.name
      );
      props.setSelectedTransferableExams(newSelectedTransferableExams);
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
      <CourseText>{props.transferableExam.name}</CourseText>
    </CourseWrapper>
  );
};

const TransferableExamGroupComponent: React.FC<
  TransferableExamGroupComponentProps
> = props => {
  return (
    <div>
      <TitleText>{props.transferableExamGroup.name}</TitleText>
      {props.transferableExamGroup.transferableExams.map(
        (transferableExam: TransferableExam) => (
          <TransferableExamComponent
            transferableExam={transferableExam}
            selectedTransferableExams={props.selectedTransferableExams}
            setSelectedTransferableExams={props.setSelectedTransferableExams}
          />
        )
      )}
    </div>
  );
};

const TransferableCreditComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedTransferableExams, setSelectedTransferableExams] = useState<
    Array<TransferableExam>
  >([]);

  const onSubmit = (): void => {
    dispatch(setExamCredits(selectedTransferableExams));
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
              {APExamGroups2020To2021.map(
                (transferableExamGroup: TransferableExamGroup) => (
                  <TransferableExamGroupComponent
                    transferableExamGroup={transferableExamGroup}
                    selectedTransferableExams={selectedTransferableExams}
                    setSelectedTransferableExams={setSelectedTransferableExams}
                  />
                )
              )}
            </Paper>
          </Grid>
          <Grid key={1} item>
            <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
              {IBExamGroups2020To2021.map(
                (transferableExamGroup: TransferableExamGroup) => (
                  <TransferableExamGroupComponent
                    transferableExamGroup={transferableExamGroup}
                    selectedTransferableExams={selectedTransferableExams}
                    setSelectedTransferableExams={setSelectedTransferableExams}
                  />
                )
              )}
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

export default TransferableCreditComponent;
