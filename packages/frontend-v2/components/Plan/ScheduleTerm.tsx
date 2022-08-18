import { VStack } from "@chakra-ui/react";
import { ScheduleTerm2 } from "@graduate/common";
import { ScheduleCourse } from "../ScheduleCourse";
import { useDroppable } from "@dnd-kit/core";

interface ScheduleTermProps {
  scheduleTerm: ScheduleTerm2<string>;
}

export const ScheduleTerm: React.FC<ScheduleTermProps> = ({ scheduleTerm }) => {
  const {} = useDroppable({ id: scheduleTerm.id });
  return (
    <VStack border="1px" p="sm">
      {scheduleTerm.classes.map((scheduleCourse) => (
        <ScheduleCourse
          scheduleCourse={scheduleCourse}
          key={scheduleCourse.id}
        />
      ))}
    </VStack>
  );
};
