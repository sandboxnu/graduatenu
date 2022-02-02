import React from "react";
import { ScheduleCourse, SeasonWord, StatusEnum } from "../../../common/types";
import { DNDSchedule, DNDScheduleTerm } from "../models/types";
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
}

const SemesterContainer = (props: SemesterContainerProps) => {
  return (
    <div>
      <SemesterTop
        year={props.year}
        status={props.semesterStatus}
        schedule={props.schedule}
        isEditable={props.isEditable}
        transferCourses={props.transferCourses}
        semester={props.semesterWord}
      />
      <SemesterBlock isEditable={props.isEditable} semester={props.semester} />
    </div>
  );
};

export default SemesterContainer;
