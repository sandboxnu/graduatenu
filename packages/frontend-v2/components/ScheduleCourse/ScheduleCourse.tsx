import { Flex, Text } from "@chakra-ui/react";
import { forwardRef } from "react";
import { ScheduleCourse2 } from "@graduate/common";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleIcon } from "@chakra-ui/icons";

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
  isDragging: boolean;
  listeners?: any;
  attributes?: any;
  transform?: string;
}

// eslint-disable-next-line react/display-name
export const ScheduleCourse = forwardRef<
  HTMLElement | null,
  ScheduleCourseProps
>(({ scheduleCourse, isDragging, transform, listeners, attributes }, ref) => {
  return (
    <Flex
      ref={ref}
      {...listeners}
      {...attributes}
      transition="none"
      transform={transform}
      cursor={isDragging ? "grabbing" : "grab"}
      variant="unstyled"
      borderRadius="md"
      boxShadow="md"
      backgroundColor="neutral.main"
      pl="2xs"
      pr="sm"
      py="sm"
      alignItems="center"
      _hover={{ bg: "neutral.700" }}
      _active={{ bg: "neutral.900" }}
    >
      <DragHandleIcon mr="md" color="primary.blue.dark.main" />
      <Text>{scheduleCourse.classId}</Text>
    </Flex>
  );
});
