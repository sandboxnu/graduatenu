import { Box, Flex, Badge, Heading, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { BETA_MAJOR_TOOLTIP_MSG } from "../../utils";
import { HelperToolTip } from "../Help";
import { UNDECIDED_CONCENTRATION } from "@graduate/common";
import ConcentrationDropdownWarning from "../Sidebar/ConcentrationDropdownWarning";

interface DashboardSidebarContainerProps {
  title: string;
  subtitle?: string;
}

const DashboardSidebarContainer: React.FC<
  PropsWithChildren<DashboardSidebarContainerProps>
> = ({ title, subtitle, children }) => {
  return (
    <Box
      pt="xl"
      borderRight="1px"
      borderRightColor="neutral.200"
      minH="100%"
      display="flex"
      flexDirection="column"
    >
      <Box px="md" pb="md">
        <Box pb="sm">
          {/* faculty label */}
          <Flex alignItems="center" pb="sm">
            <Badge
              borderColor="red"
              borderWidth="1px"
              variant="outline"
              colorScheme="red"
              fontWeight="bold"
              fontSize="sm"
              borderRadius="md"
              mr="sm"
            >
              FACULTY
            </Badge>
            <HelperToolTip label={BETA_MAJOR_TOOLTIP_MSG} />
          </Flex>

          <Flex alignItems="center" columnGap="2xs">
            <Heading
              as="h1"
              fontSize="2xl"
              color="primary.blue.dark.main"
              fontWeight="bold"
            >
              {title}
            </Heading>
          </Flex>
          {subtitle && (
            <Text
              fontSize="sm"
              color={
                subtitle === UNDECIDED_CONCENTRATION
                  ? "red.500"
                  : "primary.blue.dark.main"
              }
              fontStyle={
                subtitle === UNDECIDED_CONCENTRATION ? "italic" : "normal"
              }
            >
              {subtitle}
            </Text>
          )}
        </Box>
      </Box>

      {children}
    </Box>
  );
};
export default DashboardSidebarContainer;
