import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const InputGroup: React.FC<PropsWithChildren> = ({ children }) => (
  <Flex
    direction="column"
    justifyContent="space-evenly"
    alignItems="center"
    width="100%"
    minHeight="3xs"
  >
    {children}
  </Flex>
);
