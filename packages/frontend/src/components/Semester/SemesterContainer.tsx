import React from "react";
import styled from "styled-components";
import { ScheduleCourse, SeasonWord, StatusEnum } from "@graduate/common";
import { DNDSchedule, DNDScheduleTerm } from "../../models/types";
import { SemesterBlock } from "./SemesterBlock";
import { SemesterTop } from "./SemesterTop";

interface SemesterContainerProps {
  isEditable: boolean;
  semester: DNDScheduleTerm;
  year: number;
  semesterStatus: StatusEnum;
  schedule: DNDSchedule;
  transferCourses: ScheduleCourse[];
  semesterWord: SeasonWord;
  isExpanded: boolean;
}

const SemesterContainerWrapper = styled.div<any>`
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
  width: 100%;
`;

export const SemesterContainer = (props: SemesterContainerProps) => {
  return (
    <SemesterContainerWrapper>
      <SemesterTop
        year={props.year}
        status={props.semesterStatus}
        schedule={props.schedule}
        isEditable={props.isEditable}
        transferCourses={props.transferCourses}
        semester={props.semesterWord}
      />
      {props.isExpanded && (
        <SemesterBlock
          isEditable={props.isEditable}
          semester={props.semester}
        />
      )}
    </SemesterContainerWrapper>
  );
};

export default SemesterContainer;
