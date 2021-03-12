import React, { useState } from "react";
import styled from "styled-components";
import { ScheduleCourse } from "../../../../common/types";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
`;

const IconsWrapper = styled.div`
  display: flex;
`;

interface ClassBlockBodyProps {
  course: ScheduleCourse;
  hovering: boolean;
  onDelete: () => void;
  hideDelete?: boolean;
  canEditBlockName?: boolean;
}

/**
 * A component to dynamically render the text/body contents of a class block.
 */
export const ClassBlockBody: React.FC<ClassBlockBodyProps> = ({
  course,
  hovering,
  onDelete,
  hideDelete,
  canEditBlockName,
}) => {
  const [blockName, setBlockName] = useState(course.name);
  const [isEditBlockName, setIsEditBlockName] = useState(false);

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{course.subject + course.classId}</Title>
        <Subtitle>{blockName}</Subtitle>
      </TitleWrapper>
      <IconsWrapper>
        {hovering && canEditBlockName && (
          <IconButton
            onClick={() => {
              setIsEditBlockName(true);
            }}
            style={{ color: "rgba(102, 102, 102, 0.3)", padding: 5 }}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        )}
        {hovering && !hideDelete && (
          <IconButton
            onClick={onDelete}
            style={{ color: "rgba(102, 102, 102, 0.3)", padding: 5 }}
            disableRipple
            disableFocusRipple
            disableTouchRipple
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        )}
      </IconsWrapper>
    </Wrapper>
  );
};
