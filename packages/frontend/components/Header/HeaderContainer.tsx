import { Flex } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

interface HeaderContainerProps {
  fixed?: boolean;
}

export const HeaderContainer: React.FC<
  PropsWithChildren<HeaderContainerProps>
> = ({ fixed, children }) => {
  return (
    <Flex
      position={fixed ? "fixed" : "static"}
      top="0"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      p="1% 1.5% 1% 1.5%"
      boxShadow={fixed ? "" : "0px 4px 7px lightgrey"}
      zIndex={1}
      backgroundColor="white"
      w="100%"
    >
      {children}
    </Flex>
  );
};
