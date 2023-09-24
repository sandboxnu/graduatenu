import { HeaderContainer } from "./HeaderContainer";
import { Logo } from "./Logo";
import { GraduateButtonLink } from "../Link";
import { UserDropdown } from "./UserDropdown";
import { Flex, Icon, IconProps, Link as ChakraLink } from "@chakra-ui/react";

export const GraduatePreAuthHeader: React.FC = () => {
  return (
    <GraduateHeader
      rightContent={
        <GraduateButtonLink href="/login">Sign In</GraduateButtonLink>
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
        <ChakraLink href="https://forms.gle/Tg9yuhR8inkrqHdN6" isExternal>
          <FeedbackIcon mx="2px" />
          Feedback
        </ChakraLink>
        <ChakraLink href="https://forms.gle/Sxg3B9js8KQ2zfJS9" isExternal>
          <BugIcon mx="2px" />
          Bug/Feature
        </ChakraLink>
        {rightContent}
      </Flex>
    </HeaderContainer>
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
