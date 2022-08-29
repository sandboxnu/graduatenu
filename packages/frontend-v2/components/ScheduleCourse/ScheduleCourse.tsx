import { Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";
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
}

export const DraggableScheduleCourse: React.FC<
  DraggableScheduleCourseProps
> = ({ scheduleCourse }) => {
  const { setNodeRef, transform, listeners, attributes, isDragging } =
    useDraggable({
      id: scheduleCourse.id,
    });

  return (
    <ScheduleCourse
      ref={setNodeRef}
      scheduleCourse={scheduleCourse}
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
    { scheduleCourse, isDragging = false, transform, listeners, attributes },
    ref
  ) => {
    return (
      <GraduateToolTip label={scheduleCourse.name} isDisabled={isDragging}>
        <Flex
          ref={ref}
          {...listeners}
          {...attributes}
          as="button"
          transform={transform}
          cursor={isDragging ? "grabbing" : "grab"}
          borderRadius="md"
          boxShadow="md"
          backgroundColor="neutral.main"
          pl="2xs"
          pr="sm"
          py="xs"
          alignItems="center"
          width="100%"
          _hover={{ bg: "neutral.700" }}
          _active={{ bg: "neutral.900" }}
        >
          <DragHandleIcon mr="md" color="primary.blue.dark.main" />
          <Text fontSize="sm" pr="2xs">
            {getCourseDisplayString(scheduleCourse)}
          </Text>
          <Text fontSize="xs" pr="md" noOfLines={1}>
            {scheduleCourse.name}
          </Text>
          <CourseTrashButton marginLeft="auto" />
        </Flex>
      </GraduateToolTip>
    );
  }
);
