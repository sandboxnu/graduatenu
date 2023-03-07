import { DeleteIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface CourseTrashButtonProps {
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
}

export const CourseTrashButton: React.FC<CourseTrashButtonProps> = ({
  onClick,
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
      onClick={onClick}
    >
      <DeleteIcon color="primary.blue.dark.300" transition="color 0.1s ease" />
    </Flex>
  );
};
