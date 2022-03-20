import React from "react";
import { Modal } from "@material-ui/core";
import styled from "styled-components";
import { XButton } from "./XButton";

const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 18px;
  cursor: pointer;
`;

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
  outline: none;
  padding-left: 35px;
  padding-bottom: 25px;
  padding-right: 35px;
`;

const InnerContainer = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 10px;
  margin-top: 30px;
`;

interface DefaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const DefaultModal: React.FC<DefaultModalProps> = (props) => {
  return (
    <Modal
      style={{ outline: "none" }}
      open={props.isOpen}
      onClose={() => null}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <OuterSection>
        <InnerContainer>
          <CloseButtonWrapper>
            <XButton onClick={props.onClose}></XButton>
          </CloseButtonWrapper>
          <ModalTitle>{props.title}</ModalTitle>
          {props.children}
        </InnerContainer>
      </OuterSection>
    </Modal>
  );
};
