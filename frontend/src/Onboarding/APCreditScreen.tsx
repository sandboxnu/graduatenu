import { Paper } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { NextButton } from "../components/common/NextButton";
import { GenericOnboardingTemplate } from "./GenericOnboarding";

const MainTitleText = styled.div`
  font-size: 16px;
  margin-left: 4px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
`;

const ScrollWrapper = styled.div`
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    background-color: #c1c1c1;
    border-color: transparent;
    border-radius: 9px 8px 8px 9px;
    border-style: solid;
    border-width: 3px 3px 3px 4px;
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 16px;
  }
  &::-webkit-scrollbar-track:vertical {
    border-left: 1px solid #e7e7e7;
    box-shadow: 1px 0 1px 0 #f6f6f6 inset, -1px 0 1px 0 #f6f6f6 inset;
  }
`;

const APCreditComponent: React.FC = () => {
  const onSubmit = (): void => {};
  return (
    <GenericOnboardingTemplate screen={4}>
      <MainTitleText>Select any courses you took for AP credit:</MainTitleText>
      <Paper
        elevation={0}
        style={{
          minWidth: 800,
          maxWidth: 800,
          minHeight: 300,
          maxHeight: 300,
          overflow: "-moz-scrollbars-vertical",
          overflowY: "scroll",
        }}
        component={ScrollWrapper}
      >
        <div>classes</div>
      </Paper>
      <Link
        to={"/signup"} // TODO create a set flow that can easily be fetched based upon the current page
        onSubmit={onSubmit}
        style={{ textDecoration: "none" }}
      >
        <NextButton />
      </Link>
    </GenericOnboardingTemplate>
  );
};

export default APCreditComponent;
