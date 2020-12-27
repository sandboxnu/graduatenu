import styled from "styled-components";

export const Container = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
`;

export const PlanTitle = styled.div`
  display: flex;
  justify-content: center;
  height: 24px;
  font-family: Roboto;
  font-weight: bold;
  font-size: 24px;
`;
export const ButtonHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 36px;
  margin-right: 10px;
  margin-bottom: 5px;
  > button {
    padding: 3px;
  }
  svg {
    font-size: 30px;
  }
`;

export const ScheduleWrapper = styled.div`
  overflow-x: scroll;
  height: 95%;
`;
