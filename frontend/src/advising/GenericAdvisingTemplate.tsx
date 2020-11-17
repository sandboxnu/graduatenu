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
const StyledTab = styled(Tab)`
  color: white !important;
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
      <HomeText>GraduateNU</HomeText>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        style={{ backgroundColor: "#EB5757" }}
        TabIndicatorProps={{
          style: {
            backgroundColor: "transparent",
            bottom: "10px",
            borderRadius: "15px",
            border: "2px solid white",
            height: "25px",
          },
        }}
        centered
      >
        <StyledTab onChange={handleChange} label="Notifications" />
        <StyledTab onChange={handleChange} label="Students" />
        <StyledTab onChange={handleChange} label="Templates" />
      </Tabs>
      {children}
    </>
  );
};
