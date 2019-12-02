import * as React from "react";
import { Modal } from "@material-ui/core";
import styled from "styled-components";
import { IWarning } from "../models/types";

const InnerSection = styled.section`
  position: fixed;
  background: white;
  width: 30%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export interface WarningModalProps {
  handleClose: () => void;
  visible: boolean;
  warning: IWarning;
}

export class WarningModal extends React.Component<WarningModalProps> {
  render() {
    return (
      <Modal
        style={{ outline: 0 }}
        open={this.props.visible}
        onClose={this.props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <InnerSection>
          <p>Warning!</p>
          <p>{this.props.warning.message}</p>
        </InnerSection>
      </Modal>
    );
  }
}
