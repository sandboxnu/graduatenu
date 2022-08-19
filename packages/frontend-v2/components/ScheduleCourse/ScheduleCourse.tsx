import { Box } from "@chakra-ui/react";
import { forwardRef } from "react";
import { ScheduleCourse2 } from "@graduate/common";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableScheduleCourseProps {
  scheduleCourse: ScheduleCourse2<string>;
}

export const DraggableScheduleCourse: React.FC<
  DraggableScheduleCourseProps
> = ({ scheduleCourse }) => {
  const { setNodeRef, transform, listeners, attributes } = useDraggable({
    id: scheduleCourse.id,
  });

  return (
    <ScheduleCourse
      ref={setNodeRef}
      scheduleCourse={scheduleCourse}
      listeners={listeners}
      attributes={attributes}
      transform={CSS.Translate.toString(transform)}
    />
  );
};

interface ScheduleCourseProps extends DraggableScheduleCourseProps {
  listeners?: any;
  attributes?: any;
  transform?: string;
}

// eslint-disable-next-line react/display-name
export const ScheduleCourse = forwardRef<
  HTMLElement | null,
  ScheduleCourseProps
>(({ scheduleCourse, transform, listeners, attributes }, ref) => {
  return (
    <Box ref={ref} {...listeners} {...attributes} transform={transform}>
      {scheduleCourse.classId}
    </Box>
  );
});
