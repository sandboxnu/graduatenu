import { DNDSchedule } from "../../models/types";
import React from "react";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import { Year } from "../Year";

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60vh;
`;

interface ScheduleProps {
  readonly schedule?: DNDSchedule;
}

const LoadingSpinner: React.FC = () => {
  return (
    <SpinnerWrapper>
      <Loader
        type="Puff"
        color="#f50057"
        height={100}
        width={100}
        timeout={5000} //5 secs
      />
    </SpinnerWrapper>
  );
};

const ScheduleComponent: React.FC<ScheduleProps> = ({ schedule }) => {
  return schedule ? (
    <>
      {schedule.years.map((year: number, index: number) => (
        <Year key={index} index={index} schedule={schedule} />
      ))}
    </>
  ) : (
    <LoadingSpinner />
  );
};

export default ScheduleComponent;
