import { Flex } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

export const HeaderContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      p="1% 1.5% 1% 1.5%"
      boxShadow="0px 4px 7px lightgrey"
    >
      {children}
    </Flex>
  );
};
