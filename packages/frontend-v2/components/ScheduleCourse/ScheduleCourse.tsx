import { Flex } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { ScheduleCourse2 } from "@graduate/common";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DeleteIcon } from "@chakra-ui/icons";

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
            padding:
              scheduleCourse.classId === "CO-OP" ? "48px 8px" : "8px 8px",
            cursor: isOverlay ? "grabbing" : "grab",
          }}
          {...listeners}
        >
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
