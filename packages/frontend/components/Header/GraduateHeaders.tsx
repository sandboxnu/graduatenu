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
import { HamburgerIcon } from "@chakra-ui/icons";

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
    <HeaderContainer>
      <Logo />
      <Flex columnGap="md" alignItems="center">
        <MetaInfoWidget />
        <Box>
          <LatestReleaseNotesIcon mx="2px" />
          Latest Release Notes
        </Box>
        <ChakraLink href="https://forms.gle/uXDfLFWvgCiYcqgf9" isExternal>
          <FeedbackIcon mx="2px" />
          Feedback
        </ChakraLink>
        <ChakraLink href="https://forms.gle/bXgRXyYTXN8wgYy78" isExternal>
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
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        d="M10.9155 4.00443C9.7147 4.05232 8.55551 4.45723 7.5861 5.16741C6.61669 5.87759 5.88112 6.86075 5.47344 7.9912C5.46257 8.02147 5.44158 8.04707 5.41401 8.06365C5.38645 8.08023 5.354 8.08678 5.32216 8.08218L4.37934 7.9404C4.32767 7.93377 4.27517 7.94134 4.22747 7.96229C4.17978 7.98323 4.13869 8.01677 4.1086 8.0593C4.0791 8.10255 4.06235 8.15323 4.06028 8.20554C4.0582 8.25786 4.07089 8.3097 4.09688 8.35515L5.59233 10.9788C5.61358 11.0159 5.64309 11.0477 5.67857 11.0716C5.71406 11.0956 5.75458 11.111 5.79699 11.1168C5.8394 11.1226 5.88257 11.1185 5.92317 11.1049C5.96376 11.0913 6.00069 11.0686 6.03109 11.0385L8.13556 8.94742C8.1724 8.91093 8.19836 8.86491 8.21052 8.8145C8.22268 8.76409 8.22055 8.71129 8.20438 8.66202C8.18821 8.61276 8.15863 8.56897 8.11896 8.53557C8.0793 8.50217 8.03112 8.48048 7.97981 8.47293L7.02248 8.33003C7.0011 8.32692 6.98074 8.31889 6.96299 8.30658C6.94524 8.29426 6.9306 8.27799 6.92021 8.25905C6.90982 8.24011 6.90397 8.21902 6.90311 8.19743C6.90226 8.17584 6.90643 8.15436 6.9153 8.13466C7.2478 7.38186 7.77574 6.73178 8.44432 6.25192C9.11289 5.77206 9.89773 5.4799 10.7173 5.40579C11.537 5.33167 12.3615 5.4783 13.1053 5.83044C13.8491 6.18258 14.4851 6.72741 14.9472 7.40835C15.4094 8.08929 15.6808 8.88153 15.7334 9.7028C15.786 10.5241 15.6178 11.3445 15.2462 12.0788C14.8747 12.8131 14.3133 13.4346 13.6205 13.8787C12.9277 14.3228 12.1286 14.5734 11.3062 14.6044C11.1211 14.6077 10.945 14.6844 10.8165 14.8176C10.688 14.9508 10.6177 15.1296 10.621 15.3147C10.6243 15.4997 10.701 15.6759 10.8343 15.8044C10.9675 15.9329 11.1463 16.0032 11.3313 15.9999H11.3576C12.1484 15.9756 12.9267 15.7952 13.6475 15.469C14.3684 15.1428 15.0176 14.6773 15.5579 14.0993C16.0982 13.5213 16.5188 12.8421 16.7956 12.1009C17.0724 11.3596 17.1999 10.571 17.1708 9.7803C17.1416 8.98961 16.9564 8.2125 16.6258 7.49366C16.2952 6.77482 15.8257 6.12846 15.2443 5.59176C14.663 5.05506 13.9812 4.63861 13.2383 4.36639C12.4954 4.09416 11.7059 3.97153 10.9155 4.00555V4.00443Z"
        fill="black"
        stroke-width="0.5"
      />
    </Icon>
  );
};

const FeedbackIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </Icon>
  );
};

const BugIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
    </Icon>
  );
};
