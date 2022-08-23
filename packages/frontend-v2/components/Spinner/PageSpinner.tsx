import { Flex, Spinner } from "@chakra-ui/react";

/**
 * A large spinner in a centered container that takes up all the space in the
 * parent container. Used primarily as a spinner for the entire page.
 */
export const PageSpinner: React.FC = () => {
  return (
    <Flex
      flex="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner size="xl" />;
    </Flex>
  );
};
