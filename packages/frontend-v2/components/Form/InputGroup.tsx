import { Flex } from "@chakra-ui/react";

export const InputGroup: React.FC = ({ children }) => (
  <Flex
    direction="column"
    justifyContent="space-evenly"
    alignItems="center"
    width="100%"
    height="80%"
    minHeight="3xs"
  >
    {children}
  </Flex>
);
