import { CheckIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

export const GreenCheckIcon: React.FC = () => {
  return (
    <Box
      bg={"states.success.main"}
      borderColor={"states.success.main"}
      color={"white"}
      borderWidth="1px"
      width="18px"
      height="18px"
      display="flex"
      transition="background 0.25s ease, color 0.25s ease, border 0.25s ease"
      transitionDelay="0.1s"
      alignItems="center"
      justifyContent="center"
      borderRadius="2xl"
      p="xs"
    >
      <CheckIcon boxSize="9px" />
    </Box>
  );
};
