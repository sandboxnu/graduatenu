import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { DNDSchedule, NamedSchedule } from "../models/types";
import { Autocomplete } from "@material-ui/lab";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import { Major, Schedule } from "../../../common/types";
import { findMajorFromName } from "../utils/plan-helpers";
import { addPrereqsToSchedule } from "../../../common/prereq_loader";
import Loader from "react-loader-spinner";
import { convertToDNDSchedule, planToString } from "../utils";
import {
  getMajors,
  getPlans,
  getMajorsLoadingFlag,
  getPlansLoadingFlag,
  getSchedulesFromState,
} from "../state";
import { setDNDScheduleAction } from "../state/actions/scheduleActions";
import { ExcelUpload } from "../components/ExcelUpload";
import { NextButton } from "../components/common/NextButton";

const EXCELTOOLTIP =
  "Auto-populate your schedule with your excel plan of study. Reach out to your advisor if you don't have it!";

const COPY_PLAN_TOOLTIP =
  "This will copy an existing plan. This will change your seleceted Major and Coop Cycle to match the exising plan";

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 700px;
`;

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

const FieldContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  > div {
    margin-top: 10px;
  }
`;

interface Props {
  allMajors: Major[];
  allPlans: Record<string, Schedule[]>;
  isFetchingMajors: boolean;
  isFetchingPlans: boolean;
  userSchedules: NamedSchedule[];
  setDNDSchedule: (schedule: DNDSchedule) => void;
}

function prepareToClose(closeModal: (visible: boolean) => void) {
  closeModal(false);
}

function openModal(openModal: (visible: boolean) => void) {
  openModal(true);
}
function renderPlanName(
  planName: string,
  planNameChange: (planName: string) => void,
  scheduleNames: string[]
) {
  const error = scheduleNames.includes(planName);
  return (
    <TextField
      id="outlined-basic"
      label="Plan Name"
      variant="outlined"
      value={planName}
      onChange={event => planNameChange(event.target.value)}
      placeholder="Plan 1"
      error={error}
      helperText={error && "Cannot have the same name as an existing plan"}
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
  plans: Schedule[],
  setCoopCycle: (coopCycle: string) => void,
  selectedCoopCycle: string
) {
  return (
    <Autocomplete
      disableListWrap
      options={plans.map(p => planToString(p))}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Select A Co-op Cycle"
          fullWidth
        />
      )}
      value={selectedCoopCycle}
      onChange={(e, value) => setCoopCycle(value ? value : "")}
    />
  );
}

function renderSelectOptions(
  selectOption: string,
  setSelectOption: (selectState: string) => void
) {
  const setSelect = (e: any) => {
    setSelectOption(e.target.value);
  };

  return (
    <FormControl variant="outlined">
      <InputLabel id="demo-simple-select-outlined-label">
        Create Plan Based On
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        labelWidth={115}
        onChange={setSelect}
        displayEmpty
        value={selectOption == "kill me" ? "" : selectOption}
      >
        <MenuItem value={"New Plan"}>New Plan</MenuItem>
        <MenuItem value={"Default Major Plan"}>Default Major Plan</MenuItem>
        <MenuItem value={"Exisitng Plan"} title={COPY_PLAN_TOOLTIP}>
          Exisitng Plan
        </MenuItem>
        <MenuItem value={"Upload Plan Of Study"} title={EXCELTOOLTIP}>
          Upload Plan Of Study
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function renderSelectPlan(
  selectedUserPlan: string,
  setSelectedUserPlan: (userPlan: string) => void,
  scheduleNames: string[]
) {
  return (
    <Autocomplete
      disableListWrap
      options={scheduleNames}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Select A Co-op Cycle"
          fullWidth
        />
      )}
      value={selectedUserPlan}
      onChange={(e, value) => setSelectedUserPlan(value ? value : "")}
    />
  );
}

function AddPlanPopperComponent(props: Props) {
  const {
    allMajors,
    allPlans,
    isFetchingMajors,
    isFetchingPlans,
    setDNDSchedule,
    userSchedules,
  } = props;
  const [visible, setVisible] = useState(false);
  const [planName, setPlanName] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<Major | undefined>(
    undefined
  );
  const [selectedCoopCycle, setSelectedCoopCycle] = useState("");
  const [selectedPlanOption, setSelectedPlanOption] = useState("");
  const [selectedUserPlan, setSelectedUserPlan] = useState("");

  const scheduleNames = userSchedules.map(schedule => schedule.name);

  const setSchedule = async (schedule: Schedule) => {
    let preReqSched = await addPrereqsToSchedule(schedule);
    const [dndschedule, counter] = convertToDNDSchedule(preReqSched, 0);
    setDNDSchedule(dndschedule);
  };

  useEffect(() => {
    const selectedSchedule = userSchedules.find(
      schedule => schedule.name === selectedUserPlan
    );
  }, [selectedUserPlan]);

  return isFetchingMajors || isFetchingPlans ? (
    <SpinnerWrapper>
      <Loader
        type="Puff"
        color="#f50057"
        height={100}
        width={100}
        timeout={5000} //5 secs
      />
    </SpinnerWrapper>
  ) : (
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
            {renderPlanName(planName, setPlanName, scheduleNames)}
            {renderMajorDropDown(allMajors, setSelectedMajor, selectedMajor)}
            {selectedMajor &&
              renderCoopCycleDropDown(
                allPlans[selectedMajor.name],
                setSelectedCoopCycle,
                selectedCoopCycle
              )}
            {renderSelectOptions(selectedPlanOption, setSelectedPlanOption)}
            {selectedPlanOption == "Upload Plan Of Study" ? (
              <ExcelUpload setSchedule={setSchedule} />
            ) : selectedPlanOption === "Exisitng Plan" ? (
              renderSelectPlan(
                selectedUserPlan,
                setSelectedUserPlan,
                scheduleNames
              )
            ) : null}
          </FieldContainer>
          <NextButton text="Submit" onClick={() => {}} />
        </InnerSection>
      </Modal>
      <Button onClick={() => openModal(setVisible)}>+ Add Plan</Button>
    </>
  );
}

const mapStateToProps = (state: AppState) => ({
  allMajors: getMajors(state),
  allPlans: getPlans(state),
  isFetchingMajors: getMajorsLoadingFlag(state),
  isFetchingPlans: getPlansLoadingFlag(state),
  userSchedules: getSchedulesFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setDNDSchedule: (schedule: DNDSchedule) =>
    dispatch(setDNDScheduleAction(schedule)),
});

export const AddPlan = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlanPopperComponent);
