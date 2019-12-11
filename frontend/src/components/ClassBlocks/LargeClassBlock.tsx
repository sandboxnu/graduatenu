import React from "react";
import styled from "styled-components";
import { DNDScheduleCourse } from "../../models/types";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Subtitle = styled.div`
  font-size: 11px;
`;

interface LargeClassBlockProps {
  course: DNDScheduleCourse;
  hovering: boolean;
  onDelete: () => void;
}

export const LargeClassBlock: React.FC<LargeClassBlockProps> = ({
  course,
  hovering,
  onDelete,
}) => {
  return (
    <Wrapper>
      <div>
        <div>{course.subject + course.classId}</div>
        <Subtitle>{course.name}</Subtitle>
      </div>
      <div style={{ visibility: hovering ? "visible" : "hidden" }}>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Wrapper>
  );
};
