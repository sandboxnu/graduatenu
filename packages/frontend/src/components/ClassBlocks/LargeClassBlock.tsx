import React from "react";
import styled from "styled-components";
import { DNDScheduleCourse } from "../../models/types";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";
import { courseToString } from "../../utils/course-helpers";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.div`
  font-weight: normal;
  font-size: 14px;
  margin-right: 4px;
`;

const Subtitle = styled.div`
  /* TODO: Fix set width to dynamically change based on parent width. */
  width: 130px;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
      <TitleWrapper>
        <Title>{courseToString(course)}</Title>
        <Subtitle>{course.name}</Subtitle>
      </TitleWrapper>
      <div
        style={{
          position: "absolute",
          right: 0,
          visibility: hovering ? "visible" : "hidden",
        }}
      >
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Wrapper>
  );
};
