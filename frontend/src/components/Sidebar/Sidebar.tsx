import React from "react";
import { DNDSchedule, Major } from "../../models/types";
import styled from "styled-components";
import { GraduateGrey } from "../../constants";
import { RequirementSection } from ".";
import { produceRequirementGroupWarning } from "../../utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  background-color: ${GraduateGrey};
  border-left: 1px solid black;
  padding: 12px;
`;

const MajorTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

interface Props {
  schedule: DNDSchedule;
  major?: Major;
}

export const Sidebar: React.FC<Props> = ({ schedule, major }) => {
  if (!major) {
    return (
      <Container>
        <MajorTitle>No major selected</MajorTitle>
      </Container>
    );
  }

  const warnings = produceRequirementGroupWarning(schedule, major);

  return (
    <Container>
      <MajorTitle>{major.name}</MajorTitle>
      {major.requirementGroups.map((req, index) => {
        return (
          <RequirementSection
            title={req}
            contents={major.requirementGroupMap[req]}
            warning={warnings.find(w => w.requirementGroup === req)}
          ></RequirementSection>
        );
      })}
    </Container>
  );
};
