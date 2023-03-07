import { DeleteIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  courseToString,
  INEUReqError,
  ScheduleCourse2,
} from "@graduate/common";
import { forwardRef, useEffect, useState } from "react";
import { DELETE_COURSE_AREA_DND_ID, isCourseFromSidebar } from "../../utils";
import { ReqErrorModal } from "../Plan/ReqErrorModal";
import { COOP_BLOCK } from "../Sidebar";

interface DraggableScheduleCourseProps {
  scheduleCourse: ScheduleCourse2<string>;
  coReqErr?: INEUReqError;
  preReqErr?: INEUReqError;
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
      isEditable={isEditable}
      isDragging={isDragging}
      listeners={listeners}
      attributes={attributes}
      transform={CSS.Translate.toString(transform)}
      isDisabled={isDisabled}
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
      isOverlay={true}
      scheduleCourse={activeCourse}
      isRemove={isRemove}
    />
  );
};

interface ScheduleCourseProps extends DraggableScheduleCourseProps {
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
}

// eslint-disable-next-line react/display-name
export const ScheduleCourse = forwardRef<
  HTMLElement | null,
  ScheduleCourseProps
>(
  (
    {
      coReqErr = undefined,
      preReqErr = undefined,
      scheduleCourse,
      removeCourse,
      isEditable = false,
      isDragging = false,
      listeners,
      attributes,
      isOverlay = false,
      isRemove,
    },
    ref
  ) => {
    const [hovered, setHovered] = useState(false);
    const isFromSidebar = isCourseFromSidebar(scheduleCourse.id);
    const isValidRemove = isRemove && !isFromSidebar;
    const isCourseError = coReqErr !== undefined || preReqErr !== undefined;

    /*
    This component uses some plain HTML elements instead of Chakra
    components due to strange performance degradation with dnd-kit.
    While it seems unintuitive, replacing Flex with div and the
    DragHandleIcon with an equivalent SVG significantly improved
    dnd responsiveness.
    */
    return (
      <div style={{ display: "relative" }}>
        {isValidRemove && <ScheduleCourseRemoveOverlay />}
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
            borderRadius: "5px",
            fontSize: "14px",
            alignItems: "stretch",
            flex: scheduleCourse.classId === COOP_BLOCK.classId ? 1 : 0,
            marginBottom: "6px",
            transition: "transform 0.15s ease, opacity 0.25s ease",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            opacity: isValidRemove ? 0.5 : 1,
            justifyContent: "space-between",
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
          />
          <Flex>
            {isCourseError && (
              <ReqErrorModal
                course={scheduleCourse}
                coReqErr={coReqErr}
                preReqErr={preReqErr}
              />
            )}
            {isEditable && hovered && (
              <ScheduleCourseTrashIcon
                removeCourse={
                  removeCourse ? () => removeCourse(scheduleCourse) : undefined
                }
              />
            )}
            {isEditable && !hovered && <ScheduleCourseSpacer />}

            {isOverlay && (
              // 2 spacers for overlay to account for both the course errors and trash icon
              <>
                <ScheduleCourseSpacer />
                <ScheduleCourseSpacer />
              </>
            )}
          </Flex>
        </div>
      </div>
    );
  }
);

/**
 * The cross icon overlay that appears over a dragged course when it is over the
 * delete area.
 */
const ScheduleCourseRemoveOverlay: React.FC = () => {
  return (
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
  );
};

/** The course components that are dragged around. */
interface ScheduleCourseDraggedContentsProps {
  scheduleCourse: ScheduleCourse2<unknown>;
  listeners: any;
  isOverlay: boolean;
}

const ScheduleCourseDraggedContents: React.FC<
  ScheduleCourseDraggedContentsProps
> = ({ scheduleCourse, listeners, isOverlay }) => {
  return (
    <div
      style={{
        padding: "8px 8px",
        cursor: isOverlay ? "grabbing" : "grab",
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
        <ScheduleCourseDragIcon />
        <p style={{ fontWeight: "bold" }}>
          {`${courseToString(scheduleCourse)} `}
          <span style={{ marginLeft: "2px", fontWeight: "normal" }}>
            {scheduleCourse.name}
          </span>
        </p>
      </div>
    </div>
  );
};

const ScheduleCourseDragIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 10 10"
      focusable="false"
      style={{
        margin: "0px 8px 0px 0px",
        width: "1em",
        height: "1em",
        display: "inline-block",
        lineHeight: "1em",
        WebkitFlexShrink: 0,
        flexShrink: 0,
        color: "var(--chakra-colors-primary-blue-dark-main)",
        verticalAlign: "middle",
      }}
    >
      <path
        fill="currentColor"
        d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"
      ></path>
    </svg>
  );
};

interface ScheduleCourseTrashIconProps {
  removeCourse?: () => void;
}
const ScheduleCourseTrashIcon: React.FC<ScheduleCourseTrashIconProps> = ({
  removeCourse,
}) => {
  return (
    <Flex
      width="32px"
      alignSelf="stretch"
      flexShrink={0}
      alignItems="center"
      justifyContent="center"
      borderRadius="0px 5px 5px 0px"
      transition="background 0.15s ease"
      _hover={{
        background: "primary.blue.dark.main",
        fill: "white",
        svg: {
          color: "white",
        },
      }}
      _active={{
        background: "primary.blue.dark.900",
      }}
      onClick={removeCourse}
    >
      <DeleteIcon color="primary.blue.dark.300" transition="color 0.1s ease" />
    </Flex>
  );
};

/**
 * This is a spacer to take up the same amount of space as the delete button so
 * we don't have the text of the course shifting around when it's hovered or dragged.
 */
const ScheduleCourseSpacer: React.FC = () => {
  return <div style={{ width: "32px", height: "32px", flexShrink: 0 }}></div>;
};
