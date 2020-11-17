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

interface GenericAdvisingTemplateProps {
  baseTab: number;
}

export const GenericAdvisingTemplate: React.FC<
  GenericAdvisingTemplateProps
> = ({ baseTab, children }) => {
  const [currentTab, setCurrentTab] = useState(baseTab);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };
  return (
    <>
      <HomeText href="#">GraduateNU</HomeText>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={currentTab}
        onChange={handleChange}
        centered
      >
        <Tab href="/advisor/notifications" label="Notifications" />
        <Tab href="/advisor/manageStudents" label="Students" />
        <Tab href="/advisor/templates" label="Templates" />
      </Tabs>
      {children}
    </>
  );
};
