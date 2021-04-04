import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ScheduleCourse } from "../../../../common/types";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import { Close as CloseIcon } from "@material-ui/icons";
import { AppState } from "../../state/reducers/state";
import { useDispatch, useSelector } from "react-redux";
import { getCourseNameFromState, getIsAdvisorFromState } from "../../state";
import { DNDScheduleCourse, DNDScheduleTerm } from "../../models/types";
import { constant } from "lodash";
import { renameCourseInActivePlanAction } from "../../state/actions/userPlansActions";

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
  course: ScheduleCourse; // can't pass DNDScheduleCourse instead because
  // NonDraggableClassBlock course does not have DndId
  dndId?: string;
  semester?: DNDScheduleTerm;
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
  dndId,
  semester,
  hovering,
  onDelete,
  hideDelete,
  canEditBlockName,
}) => {
  const { courseName: courseName } =
    useSelector((state: AppState) => ({
      courseName: getCourseNameFromState(state, dndId, semester),
    })) || course.name;

  const [blockName, setBlockName] = useState(courseName);
  const [isEditBlockName, setIsEditBlockName] = useState(false);
  const { isAdvisor } = useSelector((state: AppState) => ({
    isAdvisor: getIsAdvisorFromState(state),
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    setBlockName(courseName);
  }, [courseName]);

  const ICONBUTTON_HEIGHT = 25;

  const editBlockNameIcons = () => {
    return (
      <IconsWrapper>
        <input
          type="text"
          style={{
            width: "100%",
          }}
          value={blockName}
          onChange={event => {
            setBlockName(event.target.value);
          }}
        />
        {/* confirm button */}
        <IconButton
          style={{ padding: 3, height: ICONBUTTON_HEIGHT }}
          onClick={() => {
            dispatch(
              renameCourseInActivePlanAction(dndId!, semester!, blockName!)
            );
            setIsEditBlockName(false);
          }}
        >
          <CheckIcon style={{ fontSize: "20px" }} />
        </IconButton>
        {/* cancel button */}
        <IconButton
          style={{ padding: 3, height: ICONBUTTON_HEIGHT }}
          onClick={() => {
            // reset it back to original name
            setBlockName(courseName);
            setIsEditBlockName(false);
          }}
        >
          <CloseIcon style={{ fontSize: "20px" }} />
        </IconButton>
      </IconsWrapper>
    );
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{course.subject + course.classId}</Title>
        {isEditBlockName ? (
          editBlockNameIcons()
        ) : (
          <Subtitle>{courseName}</Subtitle>
        )}
      </TitleWrapper>
      {!isEditBlockName && (
        <IconsWrapper>
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
          {canEditBlockName && isAdvisor && (
            <IconButton
              onClick={() => {
                setIsEditBlockName(true);
              }}
              style={{ color: "rgba(102, 102, 102, 0.3)", padding: 5 }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          )}
        </IconsWrapper>
      )}
    </Wrapper>
  );
};
