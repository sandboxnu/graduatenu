import React from "react";
import styled from "styled-components";
import { DNDScheduleCourse } from "../../models/types";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";
import { courseToString } from "../../utils/course-helpers";

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

interface SmallClassBlockProps {
  course: DNDScheduleCourse;
  hovering: boolean;
  onDelete: () => void;
}

export const SmallClassBlock: React.FC<SmallClassBlockProps> = ({
  course,
  hovering,
  onDelete,
}) => {
  return (
    <Wrapper>
      <TextWrapper>
        <Title>{courseToString(course)}</Title>
        <Subtitle>{course.name}</Subtitle>
      </TextWrapper>
      <div style={{ visibility: hovering ? "visible" : "hidden" }}>
        <IconButton onClick={onDelete} size="small" style={{ marginRight: 9 }}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Wrapper>
  );
};
