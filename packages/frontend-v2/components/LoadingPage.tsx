import { Box, Flex, Spinner } from "@chakra-ui/react";
import { ReactElement } from "react";

interface LoadingPageProps {
  header?: ReactElement;
}

/** Use this component to render the loading state of an entire page. */
export const LoadingPage: React.FC<LoadingPageProps> = ({ header }) => {
  return (
    <Flex height="100vh">
      {header}
      <Flex
        flex="1"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Flex>
    </Flex>
  );
};
