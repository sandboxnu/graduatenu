import { Box, Flex } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { NextPage } from "next";
import { PropsWithChildren, useContext } from "react";
import { GraduatePostAuthHeader, GraduatePreAuthHeader } from "../components";
import { IsGuestContext } from "./_app";
import { DELETE_COURSE_AREA_DND_ID } from "../utils";
import { DashboardSidebar } from "../components/DashboardSidebar";

const DashboardPage: NextPage = () => {
  return (
    <PageLayout>
      <Box
        bg="neutral.100"
        overflowY="auto"
        width={{ desktop: "360px", tablet: "300px" }}
        flexShrink={0}
      >
        <DashboardSidebar />
      </Box>

      <Box
        overflowY="auto"
        width={{ desktop: "1036px", tablet: "590px" }}
        outline="primary.blue.light.main"
        borderWidth="1.5px"
        borderRadius="16px"
        margin="20px"
      ></Box>
    </PageLayout>
  );
};

/** Basic Layout(i.e: header, sidebar, etc). */
const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { setNodeRef } = useDroppable({ id: DELETE_COURSE_AREA_DND_ID });
  const { isGuest } = useContext(IsGuestContext);
  return (
    <Flex
      flexDirection="column"
      height="100vh"
      overflow="hidden"
      ref={setNodeRef}
    >
      {isGuest ? (
        <GraduatePreAuthHeader hasWhatsNew={false} />
      ) : (
        <GraduatePostAuthHeader hasWhatsNew={false} />
      )}
      <Flex height="100%" overflow="hidden">
        {children}
      </Flex>
    </Flex>
  );
};

export default DashboardPage;
