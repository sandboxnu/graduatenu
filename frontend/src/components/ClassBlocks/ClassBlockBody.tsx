import React from "react";
import styled from "styled-components";
import { ScheduleCourse } from "../../../../common/types";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";

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
  width: 100%;
`;

const Title = styled.div`
  font-weight: normal;
  font-size: 14px;
  margin-right: 4px;
`;

const Subtitle = styled.div`
  margin-right: 8px;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex: 1;
`;

interface ClassBlockBodyProps {
  course: ScheduleCourse;
  hovering: boolean;
  onDelete: () => void;
  hideDelete?: boolean;
}

/**
 * A component to dynamically render the text/body contents of a class block.
 */
export const ClassBlockBody: React.FC<ClassBlockBodyProps> = ({
  course,
  hovering,
  onDelete,
  hideDelete,
}) => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{course.subject + course.classId}</Title>
        <Subtitle>{course.name}</Subtitle>
      </TitleWrapper>
      <div
        style={{
          right: 0,
          visibility: hovering ? "visible" : "hidden",
        }}
      >
        {!hideDelete && (
          <IconButton
            onClick={onDelete}
            style={{ color: "rgba(102, 102, 102, 0.3)" }}
            disableRipple
            disableFocusRipple
            disableTouchRipple
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        )}
      </div>
    </Wrapper>
  );
};
