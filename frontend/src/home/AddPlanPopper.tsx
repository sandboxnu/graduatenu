import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { Button, Modal, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import { Major, Schedule } from "../../../common/types";
import { findMajorFromName } from "../utils/plan-helpers";
import {
  getMajors,
  getPlans,
  getMajorsLoadingFlag,
  getPlansLoadingFlag,
} from "../state";
import { planToString } from "../utils";

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
  outline: none;
  padding-bottom: 24px;
  min-width: 300px;
`;
const PlanPopperButton = styled(Button)<any>`
  background: #e0e0e0;
  font-weight: normal;
  float: right;
  margin: 10px;
`;

const PlanContainer = styled.div`
  position: relative;
  align-items: flex-end;
  padding: 10px;
  margin: 0px;
`;
const FieldContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
`;

interface Props {
  allMajors: Major[];
}

function prepareToClose(closeModal: (visible: boolean) => void) {
  closeModal(false);
}

function openModal(openModal: (visible: boolean) => void) {
  openModal(true);
}
function renderPlanName(
  planName: string,
  planNameChange: (planName: string) => void
) {
  return (
    <TextField
      id="outlined-basic"
      label="Plan Name"
      variant="outlined"
      value={planName}
      onChange={event => planNameChange(event.target.value)}
      placeholder="Plan 1"
    />
  );
}

function renderMajorDropDown(
  majors: Major[],
  selectedMajorChange: (major?: Major) => void,
  selectedMajor?: Major
) {
  return (
    <Autocomplete
      disableListWrap
      options={majors.map(maj => maj.name)}
      renderInput={params => (
        <TextField {...params} variant="outlined" label="Major" fullWidth />
      )}
      value={!!selectedMajor ? selectedMajor.name + " " : ""}
      onChange={(e, value) =>
        selectedMajorChange(findMajorFromName(value, majors))
      }
    />
  );
}

function renderCoopCycleDropDown(
  major: Major,
  plans: Record<string, Schedule[]>,
  selectedCoopCycle: string
) {
  return (
    <Autocomplete
      disableListWrap
      options={plans[major!.name].map(p => planToString(p))}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Select A Co-op Cycle"
          fullWidth
        />
      )}
      value={selectedCoopCycle || ""}
      //   onChange={this.onChangePlan.bind(this)}
    />
  );
}

function AddPlanPopperComponent(props: Props) {
  const { allMajors } = props;
  const [visible, setVisible] = useState(false);
  const [planName, setPlanName] = useState("");
  const [major, setMajor] = useState<Major | undefined>(undefined);

  return (
    <>
      <Modal
        style={{ outline: "none" }}
        open={visible}
        onClose={() => prepareToClose(setVisible)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <InnerSection>
          <h1 id="simple-modal-title">Create a New Plan</h1>
          <FieldContainer>
            {renderPlanName(planName, setPlanName)}
            {renderMajorDropDown(allMajors, setMajor, major)}
            {/* {renderCoopCycleDropDown(major, allPlans , selectedCoopCycle)} */}
          </FieldContainer>
        </InnerSection>
      </Modal>
      <Button onClick={() => openModal(setVisible)}>Hello</Button>
    </>
  );
}

const mapStateToProps = (state: AppState) => ({
  allMajors: getMajors(state),
  allPlans: getPlans(state),
  isFetchingMajors: getMajorsLoadingFlag(state),
  isFetchingPlans: getPlansLoadingFlag(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export const AddPlan = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlanPopperComponent);
