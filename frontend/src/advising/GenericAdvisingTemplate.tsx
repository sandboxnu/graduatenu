import React, { useState } from "react";
import styled from "styled-components";
import { Tabs, Tab } from "@material-ui/core";
import { Link } from "react-router-dom";

const HomeText = styled.a`
  font-weight: bold;
  font-size: 36px;
  text-decoration: none;
  color: black;
`;

interface GenericAdvisingTemplateProps {}

export const GenericAdvisingTemplate: React.FC<
  GenericAdvisingTemplateProps
> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState("Notifications");
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setCurrentTab(newValue);
  };
  return (
    <>
      <HomeText href="#">GraduateNU</HomeText>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Link to="/advisor/notifications">
          <Tab label="Notifications" />
        </Link>
        <Link to="/advisor/manageStudents">
          <Tab label="Students" />
        </Link>
        <Link to="/advisor/templates">
          <Tab label="Templates" />
        </Link>
      </Tabs>
      {children}
    </>
  );
};
