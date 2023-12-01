import { DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  courseToString,
  INEUReqError,
  IRequiredCourse,
  ScheduleCourse2,
} from "@graduate/common";
import { forwardRef, PropsWithChildren, useEffect, useState } from "react";
import {
  DELETE_COURSE_AREA_DND_ID,
  SEARCH_NEU_FETCH_COURSE_ERROR_MSG,
  isCourseFromSidebar,
} from "../../utils";
import { ReqErrorModal } from "../Plan/ReqErrorModal";
import { COOP_BLOCK } from "../Sidebar";
import { CourseDragIcon } from "./CourseDragIcon";
import { CourseTrashButton } from "./CourseTrashButton";
import { GraduateToolTip } from "../GraduateTooltip";

interface DraggableScheduleCourseProps {
  scheduleCourse: ScheduleCourse2<string>;
  coReqErr?: INEUReqError;
  preReqErr?: INEUReqError;
  isInSidebar?: boolean;
  isChecked?: boolean;
  /** Function to remove the course from whatever the schedule it is part of. */
  removeCourse?: (course: ScheduleCourse2<unknown>) => void;
  isEditable?: boolean;
  isDisabled?: boolean;
  /** Only provide this prop to the overlay course being dragged around the screen. */
  setIsRemove?: (val: boolean) => void;
}

/** This is the static course on the page that can be dragged around. */
export const DraggableScheduleCourse: React.FC<
  DraggableScheduleCourseProps
> = ({
  scheduleCourse,
  removeCourse,
  preReqErr = undefined,
  coReqErr = undefined,
  isInSidebar = false,
  isChecked = false,
  isEditable = false,
  isDisabled = false,
  setIsRemove,
}) => {
  const { setNodeRef, transform, listeners, attributes, isDragging, over } =
    useDraggable({
      id: scheduleCourse.id,
      data: {
        course: scheduleCourse,
      },
      disabled: isDisabled,
    });

  useEffect(() => {
    if (setIsRemove) setIsRemove(over?.id === DELETE_COURSE_AREA_DND_ID);
  }, [over, setIsRemove]);

  return (
    <ScheduleCourse
      coReqErr={coReqErr}
      preReqErr={preReqErr}
      ref={setNodeRef}
      scheduleCourse={scheduleCourse}
      removeCourse={removeCourse}
      isInSidebar={isInSidebar}
      isChecked={isChecked}
      isEditable={isEditable}
      isDragging={isDragging}
      listeners={listeners}
      attributes={attributes}
      transform={CSS.Translate.toString(transform)}
      isDisabled={isDisabled}
      isFromSidebar={isCourseFromSidebar(scheduleCourse.id)}
      isDraggable
    />
  );
};

interface DraggedScheduleCourseProps {
  /** The course being dragged around */
  activeCourse: ScheduleCourse2<string>;
  /** Is the course overlay being dragged over the delete course area? */
  isRemove: boolean;
}

/** The course overlay that is being dragged around the screen. */
export const DraggedScheduleCourse: React.FC<DraggedScheduleCourseProps> = ({
  activeCourse,
  isRemove,
}) => {
  return (
    <ScheduleCourse
      isDisabled={false}
      isOverlay
      scheduleCourse={activeCourse}
      isRemove={isRemove}
      isFromSidebar={isCourseFromSidebar(activeCourse.id)}
      isDraggable
    />
  );
};

interface NonDraggableScheduleCourseProps {
  scheduleCourse: ScheduleCourse2<unknown>;
  removeCourse: (course: ScheduleCourse2<unknown>) => void;
}

export const NonDraggableScheduleCourse: React.FC<
  NonDraggableScheduleCourseProps
> = ({ scheduleCourse, removeCourse }) => {
  return (
    <ScheduleCourse
      scheduleCourse={scheduleCourse}
      isDisabled={false}
      isEditable={true}
      removeCourse={removeCourse}
      isDraggable={false}
    />
  );
};

interface PlaceholderScheduleCourseProps {
  course: IRequiredCourse;
}

export const PlaceholderScheduleCourse: React.FC<
  PlaceholderScheduleCourseProps
> = ({ course }) => {
  return (
    <GraduateToolTip label={SEARCH_NEU_FETCH_COURSE_ERROR_MSG}>
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          borderRadius: "5px",
          fontSize: "14px",
          alignItems: "stretch",
          marginBottom: "6px",
          padding: "6px",
          transition: "transform 0.15s ease",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontWeight: "bold" }}>
          {course.subject}
          <span style={{ marginLeft: "2px" }}>{course.classId}</span>
        </p>
      </div>
    </GraduateToolTip>
  );
};

interface ScheduleCourseProps
  extends Omit<DraggableScheduleCourseProps, "scheduleCourse"> {
  /** Since a ScheduleCourse is purely stylistic, it doesn't care about dnd ids. */
  scheduleCourse: ScheduleCourse2<unknown>;
  /**
   * Does this static course have an overlay on the screen that is being dragged
   * around? Is dragging applies to static courses(not the overlay being dragged
   * around). Hence, this field is always false for overlays.
   */
  isDragging?: boolean;
  listeners?: any;
  attributes?: any;
  transform?: string;
  isDisabled: boolean;
  /** Is this the course being dragged around? */
  isOverlay?: boolean;
  isRemove?: boolean;
  isFromSidebar?: boolean;
  isDraggable?: boolean;
}

/** A ScheduleCourse is purely stylistic. */
// eslint-disable-next-line react/display-name
const ScheduleCourse = forwardRef<HTMLElement | null, ScheduleCourseProps>(
  (
    {
      coReqErr = undefined,
      preReqErr = undefined,
      scheduleCourse,
      removeCourse,
      isInSidebar = false,
      isChecked = false,
      isEditable = false,
      isDragging = false,
      listeners,
      attributes,
      isOverlay = false,
      isRemove,
      isFromSidebar,
      isDraggable,
    },
    ref
  ) => {
    const [hovered, setHovered] = useState(false);
    const isValidRemove = isRemove && !isFromSidebar;
    const isCourseError = coReqErr !== undefined || preReqErr !== undefined;

    /*
    This component uses some plain HTML elements instead of Chakra
    components due to strange performance degradation with dnd-kit.
    While it seems unintuitive, replacing Flex with div and the
    DragHandleIcon with an equivalent SVG significantly improved
    dnd responsiveness.
    */
    const renderedScheduleCourse = (
      <div
        style={{
          backgroundColor: isOverlay ? "lightgrey" : "white",
          display: "flex",
          /*
          Visibility for the copy of the course left behind when the course
          is being dragged. Keep sidebar course copies visable but hide
          copies of courses in the Plan.
          */
          visibility: isDragging && !isFromSidebar ? "hidden" : "",
          borderRadius: "10px",
          fontSize: "14px",
          alignItems: "stretch",
          flex: scheduleCourse.classId === COOP_BLOCK.classId ? 1 : 0,
          marginBottom: "6px",
          transition: "transform 0.15s ease, opacity 0.25s ease",
          transform: hovered && isDraggable ? "scale(1.04)" : "scale(1)",
          opacity: isValidRemove ? 0.5 : 1,
          justifyContent: "space-between",
          width: "100%",
        }}
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
        ref={ref}
        {...attributes}
      >
        <ScheduleCourseDraggedContents
          scheduleCourse={scheduleCourse}
          listeners={listeners}
          isOverlay={isOverlay}
          isDraggable={isDraggable}
        />
        <Flex alignItems={"center"}>
          {isCourseError && (
            <ReqErrorModal
              setHovered={setHovered}
              course={scheduleCourse}
              coReqErr={coReqErr}
              preReqErr={preReqErr}
            />
          )}
          {isEditable && hovered && (
            <CourseTrashButton
              onClick={
                removeCourse ? () => removeCourse(scheduleCourse) : undefined
              }
            />
          )}
          {isInSidebar && isChecked && (
            <Box
              bg={"states.success.main"}
              borderColor={"states.success.main"}
              color={"white"}
              borderWidth="1px"
              width="18px"
              height="18px"
              display="flex"
              transition="background 0.25s ease, color 0.25s ease, border 0.25s ease"
              transitionDelay="0.1s"
              alignItems="center"
              justifyContent="center"
              borderRadius="2xl"
              margin="8px"
              p="xs"
            >
              <CheckIcon position="absolute" boxSize="9px" />
            </Box>
          )}

          {isEditable && !hovered && <ScheduleCourseSpacer />}

          {isOverlay && !isFromSidebar && (
            // 2 spacers for overlay to account for both the course errors and trash icon
            <>
              <ScheduleCourseSpacer />
              <ScheduleCourseSpacer />
            </>
          )}
        </Flex>
      </div>
    );

    return isValidRemove ? (
      <ScheduleCourseRemoveOverlay>
        {renderedScheduleCourse}
      </ScheduleCourseRemoveOverlay>
    ) : (
      renderedScheduleCourse
    );
  }
);

/**
 * Adds the cross icon overlay that appears over a dragged course when it is
 * over the delete area.
 */
const ScheduleCourseRemoveOverlay: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div style={{ display: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex: 10,
        }}
      >
        <DeleteIcon color="primary.red.main" width="17.5" height="17.5" />
      </div>
      {children}
    </div>
  );
};

/** The course components that are dragged around. */
interface ScheduleCourseDraggedContentsProps {
  scheduleCourse: ScheduleCourse2<unknown>;
  listeners: any;
  isOverlay: boolean;
  isDraggable?: boolean;
}

const ScheduleCourseDraggedContents: React.FC<
  ScheduleCourseDraggedContentsProps
> = ({ scheduleCourse, listeners, isOverlay, isDraggable }) => {
  return (
    <div
      style={{
        padding: isDraggable ? "8px 8px" : "8px 12px",
        cursor: isOverlay ? "grabbing" : isDraggable ? "grab" : "default",
        flexGrow: "1",
      }}
      {...listeners}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {isDraggable && <CourseDragIcon />}
        <p style={{ lineHeight: 1.3 }}>
          <span style={{ marginRight: "2px", fontWeight: "bold" }}>
            {`${courseToString(scheduleCourse)} `}
          </span>
          <span>{scheduleCourse.name}</span>
        </p>
      </div>
    </div>
  );
};

/**
 * This is a spacer to take up the same amount of space as the delete button so
 * we don't have the text of the course shifting around when it's hovered or dragged.
 */
const ScheduleCourseSpacer: React.FC = () => {
  return <div style={{ width: "32px", height: "32px", flexShrink: 0 }}></div>;
};
