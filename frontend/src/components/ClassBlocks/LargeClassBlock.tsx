import React from "react";
import styled from "styled-components";
import { DNDScheduleCourse } from "../../models/types";

const TextWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 7px;
  align-items: start;
`;

const Subtitle = styled.div`
  font-size: 11px;
`;

interface LargeClassBlockProps {
  course: DNDScheduleCourse;
}

export const LargeClassBlock: React.FC<LargeClassBlockProps> = ({ course }) => {
  return (
    <TextWrapper>
      <div>{course.subject + course.classId}</div>
      <Subtitle>{course.name}</Subtitle>
    </TextWrapper>
  );
};
