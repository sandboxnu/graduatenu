import { Flex } from "@chakra-ui/react";
import { FormEventHandler } from "react";

interface FormStructureProps {
  onSubmit: FormEventHandler<HTMLDivElement>
}

export const FormFormat: React.FC<FormStructureProps> = ({ onSubmit, children }) => (
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

export const HeaderAndInput: React.FC = ({
  children,
}) => (
  <Flex
    direction="column"
    justifyContent="space-between"
    alignItems="center"
    height="50%"
    width="100%"
  >
    {children}
  </Flex>
);

export const FormButtons: React.FC = ({ children }) => (
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
