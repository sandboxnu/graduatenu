import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import {
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { DNDSchedule, IPlanData } from "../models/types";
import { Autocomplete } from "@material-ui/lab";
import { IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import { Major, Schedule, ScheduleCourse } from "../../../common/types";
import { findMajorFromName } from "../utils/plan-helpers";
import { addPrereqsToSchedule } from "../../../common/prereq_loader";
import Loader from "react-loader-spinner";
import { createPlanForUser } from "../services/PlanService";
import {
  convertToDNDSchedule,
  planToString,
  generateInitialSchedule,
  generateInitialScheduleNoCoopCycle,
  generateInitialScheduleFromExistingPlan,
} from "../utils";
import {
  getMajorsFromState,
  getPlansFromState,
  getMajorsLoadingFlagFromState,
  getPlansLoadingFlagFromState,
  getUserIdFromState,
  getUserPlansFromState,
  getAcademicYearFromState,
  getGraduationYearFromState,
  getCompletedCoursesFromState,
} from "../state";
import { addNewPlanAction } from "../state/actions/userPlansActions";
import { ExcelUpload } from "../components/ExcelUpload";
import { NextButton } from "../components/common/NextButton";
import { ColoredButton } from "../components/common/ColoredButton";
import { getAuthToken } from "../utils/auth-helpers";

const EXCEL_TOOLTIP =
  "Auto-populate your schedule with your excel plan of study. Reach out to your advisor if you don't have it!";

const COPY_PLAN_TOOLTIP =
  "This will copy an existing plan. This will change your seleceted Major and Coop Cycle to match the exising plan";

const ERROR_MESSAGE =
  "Please fill in the plan name and what the plan should be based on";

const PLAN_OPTIONS = {
  NEW_PLAN: "New Plan",
  EXISTING_PLAN: "Existing Plan",
  EXAMPLE_PLAN: "Example Major Plan",
  UPLOAD_PLAN: "Upload Plan Of Study",
};

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

const ErrorTextWrapper = styled.div`
  display: flex;
  flex: 1;
  margin: 8px;
  flex-direction: row;
  justify-content: center;
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
`;

interface Props {
  allMajors: Major[];
  allPlans: Record<string, Schedule[]>;
  isFetchingMajors: boolean;
  isFetchingPlans: boolean;
  userPlans: IPlanData[];
  userId?: number;
  addNewPlan: (plan: IPlanData, academicYear: number) => void;
  academicYear: number;
  graduationYear: number;
  completedCourses: ScheduleCourse[];
}

/**
 * If a user is currently logged in, saves the current plan under this user.
 * Only supports updating a user's singular plan, can be modified later to
 * update a specific plan.
 */
function AddPlanPopperComponent(props: Props) {
  const {
    allMajors,
    allPlans,
    isFetchingMajors,
    isFetchingPlans,
    userPlans,
    userId,
    addNewPlan,
  } = props;
  const [visible, setVisible] = useState(false);
  const [planName, setPlanName] = useState<string | null>(null);
  const [selectedCatalogYear, setSelectedCatalogYear] = useState<number | null>(
    null
  );
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [selectedCoopCycle, setSelectedCoopCycle] = useState<string | null>(
    null
  );
  const [selectedPlanOption, setSelectedPlanOption] = useState<string | null>(
    null
  );
  const [selectedUserPlan, setSelectedUserPlan] = useState<string | null>(null);
  const [error, setError] = useState(false);
  let selectedDNDSchedule = useRef<DNDSchedule | undefined>(undefined);
  let counter = useRef(0);

  const scheduleNames = userPlans.map(plan => plan.name);

  const setSchedule = async (schedule: Schedule) => {
    let preReqSched = await addPrereqsToSchedule(schedule);
    [selectedDNDSchedule.current, counter.current] = convertToDNDSchedule(
      preReqSched,
      0
    );
  };

  useEffect(() => {
    if (selectedUserPlan) {
      const plan = userPlans.find(
        schedule => schedule.name === selectedUserPlan
      )!;
      setSelectedMajor(findMajorFromName(plan.major, allMajors) || null);
      setSelectedCoopCycle(plan.coopCycle || "");
      selectedDNDSchedule.current = plan.schedule;
      counter.current = plan.courseCounter;
    }
  }, [selectedUserPlan, userPlans, allMajors]);

  useEffect(() => {
    if (error) {
      setError(false);
    }
  }, [
    planName,
    selectedCatalogYear,
    selectedMajor,
    selectedCoopCycle,
    selectedPlanOption,
    selectedUserPlan,
  ]);

  const onSubmit = async () => {
    if (selectedCoopCycle && selectedPlanOption === PLAN_OPTIONS.NEW_PLAN) {
      [selectedDNDSchedule.current, counter.current] = generateInitialSchedule(
        props.academicYear,
        props.graduationYear,
        props.completedCourses,
        selectedMajor!.name,
        selectedCoopCycle,
        allPlans
      );
    } else if (selectedPlanOption === PLAN_OPTIONS.NEW_PLAN) {
      [
        selectedDNDSchedule.current,
        counter.current,
      ] = generateInitialScheduleNoCoopCycle(
        props.academicYear,
        props.graduationYear,
        props.completedCourses
      );
    } else if (selectedPlanOption === PLAN_OPTIONS.EXAMPLE_PLAN) {
      [
        selectedDNDSchedule.current,
        counter.current,
      ] = generateInitialScheduleFromExistingPlan(
        props.academicYear,
        props.graduationYear,
        selectedMajor!.name,
        selectedCoopCycle!,
        allPlans
      );
    }

    if (
      !planName ||
      !selectedDNDSchedule.current ||
      scheduleNames.includes(planName!)
    ) {
      setError(true);
      return;
    } else {
      await savePlan();
      prepareToClose();
    }
  };

  const savePlan = async () => {
    const token = getAuthToken();
    const plan = await createPlanForUser(userId!, token, {
      name: planName!,
      link_sharing_enabled: false,
      schedule: selectedDNDSchedule.current!,
      catalog_year: selectedCatalogYear,
      major: selectedMajor ? selectedMajor.name : null,
      coop_cycle: selectedCoopCycle,
      course_counter: counter.current,
    });
    addNewPlan(plan.plan, props.academicYear);
  };

  const openModal = (): void => setVisible(true);

  const prepareToClose = () => {
    setVisible(false);
    setPlanName(null);
    setSelectedCatalogYear(null);
    setSelectedMajor(null);
    setSelectedCoopCycle(null);
    setSelectedPlanOption(null);
    setSelectedUserPlan(null);
    setError(false);
  };

  const renderPlanName = () => {
    let error = false;
    if (planName) {
      error = scheduleNames.includes(planName);
    }

    return (
      <TextField
        id="outlined-basic"
        label="Plan Name"
        variant="outlined"
        value={planName}
        onChange={event => setPlanName(event.target.value)}
        placeholder="Plan 1"
        error={error}
        helperText={error && "Cannot have the same name as an existing plan"}
      />
    );
  };

  const renderCatalogYearDropdown = () => {
    let catalogYears = [
      ...Array.from(new Set(allMajors.map(maj => maj.yearVersion.toString()))),
    ];

    // To avoid displaying "null"
    const value = selectedCatalogYear ? String(selectedCatalogYear) : undefined;

    return (
      <Autocomplete
        style={{ marginTop: "10px", marginBottom: "5px" }}
        disableListWrap
        options={catalogYears}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Catalog Year"
            fullWidth
          />
        )}
        value={value}
        onChange={(e, value) => {
          setSelectedCatalogYear(value === "" ? null : Number(value));
          setSelectedMajor(null);
          setSelectedCoopCycle(null);
        }}
      />
    );
  };

  const renderMajorDropDown = () => {
    return (
      <Autocomplete
        disableListWrap
        options={allMajors
          .filter(maj => maj.yearVersion === selectedCatalogYear)
          .map(maj => maj.name)}
        renderInput={params => (
          <TextField {...params} variant="outlined" label="Major" fullWidth />
        )}
        value={!!selectedMajor ? selectedMajor.name + " " : ""}
        onChange={(e, value) => {
          setSelectedMajor(findMajorFromName(value, allMajors) || null);
          setSelectedCoopCycle(null);
        }}
      />
    );
  };

  const renderCoopCycleDropDown = () => {
    return (
      <Autocomplete
        disableListWrap
        options={allPlans[selectedMajor!.name].map(p => planToString(p))}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Co-op Cycle"
            fullWidth
          />
        )}
        value={selectedCoopCycle}
        onChange={(e, value) => {
          setSelectedCoopCycle(value || null);
          if (!value && selectedPlanOption === PLAN_OPTIONS.EXAMPLE_PLAN)
            setSelectedPlanOption(null);
        }}
      />
    );
  };

  const renderSelectOptions = () => {
    const setSelect = (e: any) => {
      setSelectedPlanOption(e.target.value);
    };
    return (
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">
          Create Plan Based On
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          labelWidth={160}
          onChange={setSelect}
          displayEmpty
          value={selectedPlanOption}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
        >
          <MenuItem value={PLAN_OPTIONS.NEW_PLAN}>
            {PLAN_OPTIONS.NEW_PLAN}
          </MenuItem>
          {selectedCoopCycle && (
            <MenuItem value={PLAN_OPTIONS.EXAMPLE_PLAN}>
              {PLAN_OPTIONS.EXAMPLE_PLAN}
            </MenuItem>
          )}
          <MenuItem
            value={PLAN_OPTIONS.EXISTING_PLAN}
            title={COPY_PLAN_TOOLTIP}
          >
            {PLAN_OPTIONS.EXISTING_PLAN}
          </MenuItem>
          <MenuItem value={PLAN_OPTIONS.UPLOAD_PLAN} title={EXCEL_TOOLTIP}>
            {PLAN_OPTIONS.UPLOAD_PLAN}
          </MenuItem>
        </Select>
      </FormControl>
    );
  };

  const renderSelectPlan = () => {
    return (
      <Autocomplete
        disableListWrap
        options={scheduleNames}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Select One of Your Plans"
            fullWidth
          />
        )}
        value={selectedUserPlan}
        onChange={(e, value) => setSelectedUserPlan(value)}
      />
    );
  };

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
        onClose={prepareToClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <InnerSection>
          <IconButton
            style={{
              padding: "3px",
              position: "absolute",
              top: "12px",
              right: "18px",
            }}
            onClick={prepareToClose}
          >
            <CloseIcon />
          </IconButton>
          <h1 id="simple-modal-title">Create a New Plan</h1>
          <FieldContainer>
            {renderPlanName()}
            {renderCatalogYearDropdown()}
            {!!selectedCatalogYear && renderMajorDropDown()}
            {!!selectedMajor && renderCoopCycleDropDown()}
            {renderSelectOptions()}
            {selectedPlanOption == PLAN_OPTIONS.UPLOAD_PLAN ? (
              <ExcelUpload setSchedule={setSchedule} />
            ) : selectedPlanOption === PLAN_OPTIONS.EXISTING_PLAN ? (
              renderSelectPlan()
            ) : null}
            {error && (
              <ErrorTextWrapper>
                <ErrorText>{ERROR_MESSAGE}</ErrorText>
              </ErrorTextWrapper>
            )}
          </FieldContainer>
          <NextButton text="Submit" onClick={onSubmit} />
        </InnerSection>
      </Modal>
      <ColoredButton onClick={() => openModal()}>+ Add Plan</ColoredButton>
    </>
  );
}

const mapStateToProps = (state: AppState) => ({
  allMajors: getMajorsFromState(state),
  allPlans: getPlansFromState(state),
  isFetchingMajors: getMajorsLoadingFlagFromState(state),
  isFetchingPlans: getPlansLoadingFlagFromState(state),
  userPlans: getUserPlansFromState(state),
  userId: getUserIdFromState(state),
  academicYear: getAcademicYearFromState(state)!,
  graduationYear: getGraduationYearFromState(state)!,
  completedCourses: getCompletedCoursesFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNewPlan: (plan: IPlanData, academicYear: number) =>
    dispatch(addNewPlanAction(plan, academicYear)),
});

export const AddPlan = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlanPopperComponent);
