import { Backdrop, Modal } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { NORTHEASTERN_RED } from "../../constants";
import { RedColorButton } from "./ColoredButtons";

const OuterSection = styled.div`
  position: fixed;
  background: white;
  width: 35%;
  height: auto;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 25px;
`;

const ModalTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 20px;
  font-family: Roboto;
  color: ${NORTHEASTERN_RED};
`;

const WarningModalText = styled.div`
  font-family: Roboto;
  margin: 20px 0px;
  text-align: center;
`;
interface DisclaimerPopupProps {
  open: boolean;
  handleClose: () => void;
}

export const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({
  open,
  handleClose,
}) => {
  return (
    <Backdrop
      open={open}
      style={{ backgroundColor: "rgba(235, 87, 87, 0.50)" }}
    >
      <Modal open={open} onClose={() => null}>
        <OuterSection>
          <ModalTitle>Important</ModalTitle>

          <WarningModalText>
            GraduateNU is not responsible for your specific graduation
            requirements. Please use the degree audit to determine your specific
            graduation requirements.
          </WarningModalText>
          <RedColorButton onClick={handleClose} style={{ margin: "20px 0px" }}>
            I understand
          </RedColorButton>
        </OuterSection>
      </Modal>
    </Backdrop>
  );
};
