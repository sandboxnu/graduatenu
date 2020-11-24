import React, { useState } from "react";
import styled from "styled-components";
import { Tabs, Tab } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";

const HomeText = styled.a`
  font-weight: bold;
  font-size: 36px;
  text-decoration: none;
  color: black;
`;
const StyledTab = styled(Tab)`
  color: white !important;
`;

const Container = styled.div`
  margin: 30px;
  background-color: "#ff76ff";
`;
const TabsWrapper = styled.div`
  margin: 20px -30px;
`;

const PATHS = [
  `/advisor/notifications`,
  `/advisor/manageStudents`,
  `/advisor/templates`,
];

interface GenericAdvisingTemplateProps {}

type Props = GenericAdvisingTemplateProps & RouteComponentProps<{}>;

const GenericAdvisingTemplate: React.FC<Props> = ({ children, history }) => {
  const curPath = history.location.pathname;
  const startTab = PATHS.findIndex(path => path === curPath);
  const [currentTab, setCurrentTab] = useState(startTab);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    history.push(PATHS[newValue]);
    setCurrentTab(newValue);
  };
  return (
    <Container>
      <HomeText>GraduateNU</HomeText>
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
          <StyledTab onChange={handleChange} label="Notifications" />
          <StyledTab onChange={handleChange} label="Students" />
          <StyledTab onChange={handleChange} label="Templates" />
        </Tabs>
      </TabsWrapper>
      {children}
    </Container>
  );
};

export const GenericAdvisingTemplateComponent = withRouter(
  GenericAdvisingTemplate
);
