import * as React from "react";
import { Schedule, Major } from "graduate-common";
import { Modal, Card } from "@material-ui/core";
import { plans } from "../plans";
import styled from "styled-components";
import { getNumCoops, isSpringCycle } from "../utils";

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
  width: 100px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid black;
  margin-left: 4px;
  margin-right: 4px;
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
        <p>{plan.years.length} Years</p>
        <p>{getNumCoops(plan)} Co-ops</p>
        <p>{isSpringCycle(plan) ? "Spring" : "Fall"} Cycle</p>
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
