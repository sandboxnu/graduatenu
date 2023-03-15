import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  Icon,
  IconProps,
} from "@chakra-ui/react";
import React from "react";
import { useStudentWithPlans } from "../../hooks";
import { handleApiClientError, logger } from "../../utils";
import router from "next/router";
import { LoadingPage } from "../Spinner";
import { AccountOverview } from "./AccountOverview";
import { ChangePassword } from "./ChangePassword";

export const UserDropdown: React.FC = () => {
  const { error, student, mutateStudent } = useStudentWithPlans();
  if (error && !student) {
    logger.error("HomePage", error);
    handleApiClientError(error, router);

    // If we couldn't fetch the student, show a blank page for now.
    // We might want to show some more actionable error in the future.
    return <div></div>;
  }

  if (!student) {
    return <LoadingPage />;
  }

  return (
    <Menu>
      <MenuButton as={Link}>
        <>
          <UserIcon mx="2px" />
          {student.fullName}
        </>
      </MenuButton>
      <MenuList>
        <MenuItem>
          <AccountOverview student={student} mutateStudent={mutateStudent} />
        </MenuItem>
        <MenuItem>
          <ChangePassword student={student} />
        </MenuItem>
        <MenuItem>Delete account</MenuItem>
        <MenuItem>Log out</MenuItem>
      </MenuList>
    </Menu>
  );
};

const UserIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          clipRule="evenodd"
        />
      </svg>
    </Icon>
  );
};
