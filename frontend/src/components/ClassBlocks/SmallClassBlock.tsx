import React from "react";
import styled from "styled-components";
import { DNDScheduleCourse } from "../../models/types";

const TextWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-top: 1px;
`;

const Title = styled.div`
  font-size: 12px;
  margin-right: 6px;
`;

const Subtitle = styled.div`
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SmallClassBlockProps {
  course: DNDScheduleCourse;
}

export const SmallClassBlock: React.FC<SmallClassBlockProps> = ({ course }) => {
  return (
    <TextWrapper>
      <Title>{course.subject + course.classId}</Title>
      <Subtitle>{course.name}</Subtitle>
    </TextWrapper>
  );
};
