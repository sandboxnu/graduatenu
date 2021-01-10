import React from "react";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import { NORTHEASTERN_RED } from "../../constants";
const SpinnerWrapper = styled.div<any>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${props => (props.isTall ? "60vh" : "auto")};
`;

interface SpinnerProps {
  isTall?: boolean;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({ isTall }) => {
  return (
    <SpinnerWrapper isTall={isTall}>
      <Loader
        type="Puff"
        color={NORTHEASTERN_RED}
        height={100}
        width={100}
        timeout={5000000} //5 secs
      />
    </SpinnerWrapper>
  );
};
