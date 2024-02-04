import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { PageSpinner } from "./PageSpinner";

interface LoadingPageProps {
  pageLayout?: React.FC<PropsWithChildren>;
}

/** Use this component to render the loading state of an entire page. */
export const LoadingPage: React.FC<LoadingPageProps> = ({
  pageLayout: PageLayout,
}) => {
  return (
    <Flex flexDirection="column" height="100vh">
      {PageLayout ? (
        <PageLayout>
          <PageSpinner />
        </PageLayout>
      ) : (
        <PageSpinner />
      )}
    </Flex>
  );
};
