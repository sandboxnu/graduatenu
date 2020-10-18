import React, { FunctionComponent, useState } from "react";
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
import { Autocomplete } from "@material-ui/lab";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import { Major, Schedule } from "../../../common/types";
import { findMajorFromName } from "../utils/plan-helpers";
import Loader from "react-loader-spinner";
import {
  getMajors,
  getPlans,
  getMajorsLoadingFlag,
  getPlansLoadingFlag,
} from "../state";
import { planToString } from "../utils";
import { ExcelUpload } from "../components/ExcelUpload";

const EXCELTOOLTIP =
  "Auto-populate your schedule with your excel plan of study. Reach out to your advisor if you don't have it!";

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
  > * {
    margin-top: 10px;
}
`;

interface Props {
  allMajors: Major[];
  allPlans: Record<string, Schedule[]>;
  isFetchingMajors: boolean;
  isFetchingPlans: boolean;
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
    e.target.value != 'kill me' && setSelectOption(e.target.value);
  };
  const openExcel = (e: any) => {
    e.preventDefault();
    const doc = document.getElementById("upload");
    doc?.click()
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
        <MenuItem value={"Exisitng Plan"}>Exisitng Plan</MenuItem>
        <MenuItem value={"kill me"} title={EXCELTOOLTIP} onClick={openExcel}>
          Upload Plan Of Study
        </MenuItem>
        <ExcelUpload
          setSchedule={() => {}}
          setSelectOption={setSelectOption}
        ></ExcelUpload>
      </Select>
    </FormControl>
  );
}

function AddPlanPopperComponent(props: Props) {
  const { allMajors, allPlans, isFetchingMajors, isFetchingPlans } = props;
  const [visible, setVisible] = useState(false);
  const [planName, setPlanName] = useState("");
  const [major, setMajor] = useState<Major | undefined>(undefined);
  const [coopCycle, setCoopCycle] = useState("");
  const [planOption, setPlanOption] = useState("");

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
            {renderPlanName(planName, setPlanName)}
            {renderMajorDropDown(allMajors, setMajor, major)}
            {major &&
              renderCoopCycleDropDown(
                allPlans[major.name],
                setCoopCycle,
                coopCycle
              )}
            {renderSelectOptions(
              planOption,
              setPlanOption
            )}
          </FieldContainer>
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export const AddPlan = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlanPopperComponent);
