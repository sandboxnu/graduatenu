import { HeaderContainer } from "./HeaderContainer";
import { Logo } from "./Logo";
import { GraduateButtonLink } from "../Link";
import { UserDropdown } from "./UserDropdown";
import {
  Flex,
  Icon,
  IconProps,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  Box,
  useMediaQuery,
} from "@chakra-ui/react";
import { MetaInfoWidget } from "../MetaInfo/MetaInfo";
import { HamburgerIcon, RepeatClockIcon } from "@chakra-ui/icons";
import {
  useWhatsNewModal,
  WhatsNewModalContextProvider,
} from "../WhatsNewModal/WhatsNewModalContextProvider";
import { MdChatBubbleOutline, MdOutlineBugReport } from "react-icons/md";

export const GraduatePreAuthHeader: React.FC = () => {
  const [isMobile] = useMediaQuery("(max-width: 640px)");

  return isMobile ? (
    <MobileHeader />
  ) : (
    <GraduateHeader
      rightContent={
        <GraduateButtonLink href="/login">Log In</GraduateButtonLink>
      }
    />
  );
};

export const GraduatePostAuthHeader: React.FC = () => {
  return <GraduateHeader rightContent={<UserDropdown />} />;
};

export const GraduateDisabledAppHeader: React.FC = () => {
  return <GraduateHeader />;
};

interface GraduateHeaderProps {
  rightContent?: React.ReactNode;
}

const GraduateHeader: React.FC<GraduateHeaderProps> = ({ rightContent }) => {
  return (
    <WhatsNewModalContextProvider>
      <GraduateHeaderContent rightContent={rightContent} />
    </WhatsNewModalContextProvider>
  );
};

const GraduateHeaderContent: React.FC<GraduateHeaderProps> = ({
  rightContent,
}) => {
  const { openModal } = useWhatsNewModal();

  return (
    <HeaderContainer>
      <Logo />
      <Flex columnGap="md" alignItems="center">
        <MetaInfoWidget />
        <Flex
          onClick={() => {
            openModal();
          }}
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
          wrap="wrap"
          alignItems="center"
        >
          <LatestReleaseNotesIcon mx="4px" />
          <Text>Latest Release Notes</Text>
        </Flex>
        <ChakraLink
          href="https://forms.gle/uXDfLFWvgCiYcqgf9"
          isExternal
          display="inline-flex"
          alignItems="center"
        >
          <FeedbackIcon mx="2px" />
          Feedback
        </ChakraLink>
        <ChakraLink
          href="https://forms.gle/bXgRXyYTXN8wgYy78"
          isExternal
          display="inline-flex"
          alignItems="center"
        >
          <BugIcon mx="2px" />
          Bug/Feature
        </ChakraLink>
        {rightContent}
      </Flex>
    </HeaderContainer>
  );
};

const MobileHeader: React.FC = () => {
  return (
    <div>
      <HeaderContainer fixed>
        <Logo />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Menu"
            icon={<HamburgerIcon />}
            variant="ghost"
            color="primary.blue.dark.main"
            _hover={{
              backgroundColor: "neutral.100",
            }}
            _active={{
              backgroundColor: "neutral.200",
            }}
          />
          <MenuList>
            <MenuItem
              icon={<FeedbackIcon />}
              as="a"
              href="https://forms.gle/uXDfLFWvgCiYcqgf9"
              target="_blank"
            >
              Feedback
            </MenuItem>
            <MenuItem
              icon={<BugIcon />}
              as="a"
              href="https://forms.gle/bXgRXyYTXN8wgYy78"
              target="_blank"
            >
              Bug/Feature
            </MenuItem>
          </MenuList>
        </Menu>
      </HeaderContainer>

      <Box
        display={{ tablet: "none", base: "flex" }}
        top="57px"
        w="100%"
        position="fixed"
        justifyContent="center"
        alignItems="center"
        bg="primary.blue.dark.main"
        h="55px"
      >
        <Text
          textColor="white"
          textAlign="center"
          fontSize="md"
          fontWeight="bold"
        >
          Open our site on desktop to get started!
        </Text>
      </Box>
    </div>
  );
};

const LatestReleaseNotesIcon: React.FC<IconProps> = (props) => {
  return <RepeatClockIcon height="16px" width="16px" {...props} />;
};

const FeedbackIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon
      as={MdChatBubbleOutline as any}
      height="20px"
      width="20px"
      {...props}
    />
  );
};

const BugIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon
      as={MdOutlineBugReport as any}
      height="20px"
      width="20px"
      {...props}
    />
  );
};
