import React, { useState } from "react";
import styled from "styled-components";
import { Tabs, Tab } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { ColoredButton } from "../components/common/ColoredButton";
import { removeAuthTokenFromCookies } from "../utils/auth-helpers";
import { useDispatch } from "react-redux";
import { resetUserAction } from "../state/actions/userActions";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

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
  const dispatch = useDispatch();
  const curPath = history.location.pathname;
  const startTab = PATHS.findIndex(path => path === curPath);
  const [currentTab, setCurrentTab] = useState(startTab);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    history.push(PATHS[newValue]);
    setCurrentTab(newValue);
  };

  const logOut = () => {
    dispatch(resetUserAction());
    window.location.reload();
    removeAuthTokenFromCookies();
    history.push("/");
  };

  return (
    <Container>
      <Header>
        <HomeText>GraduateNU</HomeText>
        <ColoredButton onClick={() => logOut()}>Logout</ColoredButton>
      </Header>
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
