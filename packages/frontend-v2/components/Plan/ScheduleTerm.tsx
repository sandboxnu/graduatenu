import { Heading, VStack } from "@chakra-ui/react";
import { ScheduleTerm2 } from "@graduate/common";
import { DraggableScheduleCourse } from "../ScheduleCourse";
import { useDroppable } from "@dnd-kit/core";

interface ScheduleTermProps {
  scheduleTerm: ScheduleTerm2<string>;
}

export const ScheduleTerm: React.FC<ScheduleTermProps> = ({ scheduleTerm }) => {
  const { isOver, setNodeRef } = useDroppable({ id: scheduleTerm.id });

  return (
    <VStack
      border="1px"
      p="sm"
      ref={setNodeRef}
      backgroundColor={isOver ? "gray.100" : undefined}
    >
      <Heading size="sm">{scheduleTerm.season.toString()}</Heading>
      {scheduleTerm.classes.map((scheduleCourse) => (
        <DraggableScheduleCourse
          scheduleCourse={scheduleCourse}
          key={scheduleCourse.id}
        />
      ))}
    </VStack>
  );
};
