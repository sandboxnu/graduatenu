import { Flex } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { ScheduleCourse2 } from "@graduate/common";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DeleteIcon } from "@chakra-ui/icons";
import { CourseDragIcon } from "./CourseDragIcon";

interface DraggableScheduleCourseProps {
  scheduleCourse: ScheduleCourse2<string>;

  /** Function to remove the course from whatever the schedule it is part of. */
  removeCourse?: (course: ScheduleCourse2<unknown>) => void;
  isEditable?: boolean;
  isDisabled?: boolean;
  isFromSidebar?: boolean;
}

export const DraggableScheduleCourse: React.FC<
  DraggableScheduleCourseProps
> = ({
  scheduleCourse,
  removeCourse,
  isEditable = false,
  isFromSidebar = false,
  isDisabled = false,
}) => {
  const { setNodeRef, transform, listeners, attributes, isDragging } =
    useDraggable({
      id: scheduleCourse.id,
      data: {
        isFromSidebar: isFromSidebar,
        course: scheduleCourse,
      },
      disabled: isDisabled,
    });

  return (
    <ScheduleCourse
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

interface ScheduleCourseProps extends DraggableScheduleCourseProps {
  isDragging?: boolean;
  listeners?: any;
  attributes?: any;
  transform?: string;
  isDisabled: boolean;
  isOverlay?: boolean;
}

// eslint-disable-next-line react/display-name
export const ScheduleCourse = forwardRef<
  HTMLElement | null,
  ScheduleCourseProps
>(
  (
    {
      scheduleCourse,
      removeCourse,
      isEditable = false,
      listeners,
      attributes,
      isOverlay = false,
    },
    ref
  ) => {
    const [hovered, setHovered] = useState(false);
    // This component uses some plain HTML elements instead of Chakra
    // components due to strange performance degradation with dnd-kit.
    // While it seems unintuitive, replacing Flex with div and the
    // DragHandleIcon with an equivalent SVG significantly improved
    // dnd responsiveness.
    return (
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          borderRadius: "5px",
          fontSize: "14px",
          alignItems: "center",
          transition: "transform 0.15s ease",
          transform: hovered ? "scale(1.04)" : "scale(1)",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            background: "",
            padding: "8px 8px",
            cursor: isOverlay ? "grabbing" : "grab",
          }}
          {...listeners}
        >
          <CourseDragIcon />
          <p style={{ fontWeight: "bold" }}>
            {scheduleCourse.classId}{" "}
            <span style={{ marginLeft: "2px", fontWeight: "normal" }}>
              {scheduleCourse.name}
            </span>
          </p>
        </div>
        {isEditable && hovered && (
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
            onClick={
              removeCourse
                ? () => {
                    removeCourse(scheduleCourse);
                  }
                : undefined
            }
          >
            <DeleteIcon
              color="primary.blue.dark.300"
              transition="color 0.1s ease"
            />
          </Flex>
        )}
        {(isOverlay || (isEditable && !hovered)) && (
          // This is a spacer to take up the same amount of space as the delete button
          // so we don't have the text of the course shifting around when it's hovered
          // or dragged.
          <div style={{ width: "32px", height: "32px", flexShrink: 0 }}></div>
        )}
      </div>
    );
  }
);
