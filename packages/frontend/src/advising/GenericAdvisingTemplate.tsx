import React, { useState } from "react";
import styled from "styled-components";
import { Tabs, Tab } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { GraduateHeader } from "../components/common/GraduateHeader";
import { useLocation } from "react-router";

const StyledTab = styled(Tab)`
  color: white !important;
`;

const Container = styled.div`
  background-color: "#ff76ff";
`;
const TabsWrapper = styled.div`
  margin: 20px 0px;
`;

const PATHS = [
  `/advisor/appointments`,
  `/advisor/manageStudents`,
  `/advisor/templates`,
];

const GenericAdvisingTemplate: React.FC = ({ children }) => {
  const location = useLocation()
  const history = useNavigate();
  const curPath = location.pathname;
  const startTab = PATHS.findIndex((path) => curPath.startsWith(path));
  const [currentTab, setCurrentTab] = useState(startTab);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    history(PATHS[newValue]);
    setCurrentTab(newValue);
  };

  return (
    <Container>
      <GraduateHeader />
      <TabsWrapper>
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
          <StyledTab onChange={handleChange} label="Appointments" />
          <StyledTab onChange={handleChange} label="Students" />
          <StyledTab onChange={handleChange} label="Templates" />
        </Tabs>
      </TabsWrapper>
      {children}
    </Container>
  );
};

export const GenericAdvisingTemplateComponent = GenericAdvisingTemplate;
