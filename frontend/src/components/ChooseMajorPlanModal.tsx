import * as React from "react";
import { Schedule, Major } from "../models/types";
import { Modal, Card } from "@material-ui/core";
import { plans } from "../plans";
import styled from "styled-components";

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

const PlansSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const PlanCard = styled(Card)`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export interface ChooseMajorPlanModalProps {
  handleClose: () => void;
  handleSubmit: (plan: Schedule) => void;
  visible: boolean;
  major?: Major;
}

export class ChooseMajorPlanModal extends React.Component<
  ChooseMajorPlanModalProps
> {
  getPlans(): Schedule[] {
    if (!this.props.major) {
      return [];
    }
    return plans[this.props.major.name];
  }

  choosePlan(index: number) {
    this.props.handleSubmit(this.getPlans()[index]);
    this.props.handleClose();
  }

  renderPlans() {
    return this.getPlans().map((plan: Schedule, index: number) => (
      <PlanCard onClick={this.choosePlan.bind(this, index)}>
        <p>Plan {index + 1}</p>
      </PlanCard>
    ));
  }

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
          <p>Choose A Plan</p>
          <PlansSection>{this.renderPlans()}</PlansSection>
        </InnerSection>
      </Modal>
    );
  }
}
