import React from "react";
import { DNDSchedule, Major } from "../../models/types";
import styled from "styled-components";
import { GraduateGrey } from "../../constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  background-color: ${GraduateGrey};
  border-left: 1px solid black;
`;

interface Props {
  schedule: DNDSchedule;
  // major: Major;
}

export const Sidebar: React.FC<Props> = ({ schedule }) => {
  return <Container></Container>;
};
