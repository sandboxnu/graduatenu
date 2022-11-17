import { Flex } from "@chakra-ui/react";
import React, { FormEventHandler, PropsWithChildren } from "react";

interface FormStructureProps {
  onSubmit: FormEventHandler<HTMLDivElement>;
}

export const FormFormat: React.FC<
  React.PropsWithChildren<FormStructureProps>
> = ({ onSubmit, children }) => (
  <Flex
    as="form"
    onSubmit={onSubmit}
    justifyContent="center"
    alignItems="center"
  >
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      height="50vh"
      width="md"
      mt="5xl"
    >
      {children}
    </Flex>
  </Flex>
);

export const HeaderAndInput: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      height="55%"
      width="100%"
    >
      {children}
    </Flex>
  );
};

export const FormButtons: React.FC<PropsWithChildren> = ({ children }) => (
  <Flex
    direction="column"
    justifyContent="space-evenly"
    alignItems="stretch"
    height="25%"
    textAlign="center"
  >
    {children}
  </Flex>
);
