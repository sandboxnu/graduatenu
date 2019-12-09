import React from "react";
import styled from "styled-components";
import { DNDScheduleCourse } from "../../models/types";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
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

const MyDeleteIcon = styled(DeleteIcon)`
  margin-right: 8px;
  height: 4px;
  width: 4px;
`;

interface SmallClassBlockProps {
  course: DNDScheduleCourse;
  hovering: boolean;
}

export const SmallClassBlock: React.FC<SmallClassBlockProps> = ({
  course,
  hovering,
}) => {
  return (
    <Wrapper>
      <TextWrapper>
        <Title>{course.subject + course.classId}</Title>
        <Subtitle>{course.name}</Subtitle>
      </TextWrapper>
      <div style={{ visibility: hovering ? "visible" : "hidden" }}>
        <MyDeleteIcon onClick={() => void 0} />
      </div>
    </Wrapper>
  );
};
