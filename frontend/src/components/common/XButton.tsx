import React from "react";
import styled from "styled-components";

const GDIV = styled.div`
  height: 20px;
  width: 2px;
  margin-left: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: rotate(45deg);
  z-index: 1;
`;

const MD = styled.div`
  height: 20px;
  width: 2px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: rotate(90deg);
  z-index: 2;
`;

export const XButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div onClick={onClick}>
      <GDIV>
        <MD></MD>
      </GDIV>
    </div>
  );
};
