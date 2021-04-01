import React from "react";
import styled from "styled-components";
import { RedColorButton } from "./ColoredButtons";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
`;

const HomeText = styled.a`
  font-weight: bold;
  font-size: 36px;
  text-decoration: none;
  color: black;
`;

interface GraduateHeaderProps {
  logOut: () => void;
}

export const GraduateHeader: React.FC<GraduateHeaderProps> = (
  props: GraduateHeaderProps
) => {
  return (
    <Header>
      <HomeText>GraduateNU</HomeText>
      <RedColorButton variant="contained" onClick={props.logOut}>
        Logout
      </RedColorButton>
    </Header>
  );
};
