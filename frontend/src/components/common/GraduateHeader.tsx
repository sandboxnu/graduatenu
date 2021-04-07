import React from "react";
import styled from "styled-components";
import { RedColorButton } from "./ColoredButtons";
import { resetStudentAction } from "../../state/actions/studentActions";
import { removeAuthTokenFromCookies } from "../../utils/auth-helpers";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
  // border-bottom: 1px solid red;
`;

const HomeText = styled.a`
  font-weight: bold;
  font-size: 36px;
  text-decoration: none;
  color: black;
`;

export const GraduateHeader: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const logOut = () => {
    dispatch(resetStudentAction());
    window.location.reload();
    removeAuthTokenFromCookies();
    history.push("/");
  };
  return (
    <Header>
      <HomeText>GraduateNU</HomeText>
      <RedColorButton variant="contained" onClick={logOut}>
        Logout
      </RedColorButton>
    </Header>
  );
};
