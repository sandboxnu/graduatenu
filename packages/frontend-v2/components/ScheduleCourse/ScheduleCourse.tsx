import { Flex, Text } from "@chakra-ui/react";
import { forwardRef } from "react";
import { ScheduleCourse2 } from "@graduate/common";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleIcon } from "@chakra-ui/icons";
import { CourseTrashButton } from "./CourseTashButton";
import { GraduateToolTip } from "../GraduateTooltip";
import { getCourseDisplayString } from "../../utils";

interface DraggableScheduleCourseProps {
  scheduleCourse: ScheduleCourse2<string>;

  /** Function to remove the course from whatever the schedule it is part of. */
  removeCourse?: (course: ScheduleCourse2<unknown>) => void;

  isEditable?: boolean;
}

export const DraggableScheduleCourse: React.FC<
  DraggableScheduleCourseProps
> = ({ scheduleCourse, removeCourse, isEditable = false }) => {
  const { setNodeRef, transform, listeners, attributes, isDragging } =
    useDraggable({
      id: scheduleCourse.id,
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
    />
  );
};

interface ScheduleCourseProps extends DraggableScheduleCourseProps {
  isDragging?: boolean;
  listeners?: any;
  attributes?: any;
  transform?: string;
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
      isDragging = false,
      transform,
      listeners,
      attributes,
    },
    ref
  ) => {
    return (
      <GraduateToolTip label={scheduleCourse.name} isDisabled={isDragging}>
        <Flex
          ref={ref}
          {...attributes}
          transform={transform}
          cursor={isDragging ? "grabbing" : "grab"}
          borderRadius="md"
          boxShadow="md"
          backgroundColor="neutral.main"
          pl="2xs"
          pr="sm"
          py="xs"
          width="100%"
          _hover={{ bg: "neutral.700" }}
          _active={{ bg: "neutral.900" }}
        >
          <Flex alignItems="center" {...listeners}>
            <DragHandleIcon mr="md" color="primary.blue.dark.main" />
            <Text fontSize="sm" pr="2xs">
              {getCourseDisplayString(scheduleCourse)}
            </Text>
            <Text fontSize="xs" pr="md" noOfLines={1}>
              {scheduleCourse.name}
            </Text>
          </Flex>
          {isEditable && (
            <CourseTrashButton
              marginLeft="auto"
              onClick={
                removeCourse ? () => removeCourse(scheduleCourse) : undefined
              }
            />
          )}
        </Flex>
      </GraduateToolTip>
    );
  }
);