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
  FormHelperText,
} from "@material-ui/core";
import { DNDSchedule, IPlanData } from "../models/types";
import { Autocomplete } from "@material-ui/lab";
import { IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import {
  Major,
  Schedule,
  ScheduleCourse,
  addPrereqsToSchedule,
} from "@graduate/common";
import { findMajorFromName } from "../utils/plan-helpers";
import { Puff } from "react-loader-spinner";
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
import { RedColorButton } from "../components/common/ColoredButtons";
import { SaveInParentConcentrationDropdown } from "../components/ConcentrationDropdown";
import { FormErrors, useForm } from "../hooks/useForm";

const EXCEL_TOOLTIP =
  "Auto-populate your schedule with your excel plan of study. Reach out to your advisor if you don't have it!";

const COPY_PLAN_TOOLTIP =
  "This will copy an existing plan. This will change your seleceted Major and Coop Cycle to match the exising plan";

const REQUIRED_FIELD_MESSAGE = "Required field";

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

interface AddPlanPopperFields {
  readonly planName: string | null;
  readonly catalogYear: number | null;
  readonly major: Major | null;
  readonly concentration: string | null;
  readonly coopCycle: string | null;
  readonly planOption: string | null;
  readonly basePlan: string | null;
}

const INIT_FIELDS: AddPlanPopperFields = {
  planName: null,
  catalogYear: null,
  major: null,
  concentration: null,
  coopCycle: null,
  planOption: PLAN_OPTIONS.NEW_PLAN,
  basePlan: null,
};

const validateValues =
  (
    scheduleNames: string[],
    selectedDNDSchedule: React.MutableRefObject<DNDSchedule | undefined>,
    noConcentrationError: boolean
  ) =>
  (values: AddPlanPopperFields): FormErrors => {
    const validatePlanName = (values: AddPlanPopperFields) => {
      // Missing plan name
      if (!values.planName) {
        return REQUIRED_FIELD_MESSAGE;
      }

      // Duplicate plan name
      if (!!values.planName && scheduleNames.includes(values.planName!)) {
        return "Cannot have the same name as an existing plan";
      }
    };

    const validatePlanOption = (values: AddPlanPopperFields) => {
      // Missing plan option
      if (!values.planOption) {
        return REQUIRED_FIELD_MESSAGE;
      }
    };

    const validateBasePlan = (values: AddPlanPopperFields) => {
      // Missing base plan
      if (
        values.planOption === PLAN_OPTIONS.EXISTING_PLAN &&
        (!values.basePlan || !selectedDNDSchedule.current)
      ) {
        return REQUIRED_FIELD_MESSAGE;
      }
    };

    const validateConcentration = () => {
      // Missing concentration
      if (noConcentrationError) {
        return REQUIRED_FIELD_MESSAGE;
      }
    };

    return {
      planName: validatePlanName(values),
      planOption: validatePlanOption(values),
      basePlan: validateBasePlan(values),
      concentration: validateConcentration(),
    };
  };

/**
 * If a user is currently logged in, saves the current plan under this user.
 * Only supports updating a user's singular plan, can be modified later to
 * update a specific plan.
 */
const AddPlanPopperComponent: React.FC<Props> = ({
  allMajors,
  allPlans,
  isFetchingMajors,
  isFetchingPlans,
  userPlans,
  userId,
  addNewPlan,
  academicYear,
  graduationYear,
  completedCourses,
}) => {
  const selectedDNDSchedule = useRef<DNDSchedule | undefined>(undefined);
  const counter = useRef(0);

  const [visible, setVisible] = useState(false);
  const [noConcentrationError, setNoConcentrationError] = useState(false);

  const scheduleNames = userPlans.map((plan) => plan.name);

  const { values, setValues, errors, checkHasError, errorsVisible, resetForm } =
    useForm<AddPlanPopperFields>(
      INIT_FIELDS,
      validateValues(scheduleNames, selectedDNDSchedule, noConcentrationError)
    );

  const {
    planName,
    catalogYear,
    major,
    concentration,
    coopCycle,
    planOption,
    basePlan,
  } = values;

  const setSchedule = async (schedule: Schedule) => {
    const preReqSched = await addPrereqsToSchedule(schedule);
    [selectedDNDSchedule.current, counter.current] = convertToDNDSchedule(
      preReqSched,
      0
    );
  };

  const onSubmit = async () => {
    if (checkHasError()) {
      return;
    }

    if (coopCycle && planOption === PLAN_OPTIONS.NEW_PLAN) {
      [selectedDNDSchedule.current, counter.current] = generateInitialSchedule(
        academicYear,
        graduationYear,
        completedCourses,
        major!.name,
        coopCycle,
        allPlans
      );
    } else if (planOption === PLAN_OPTIONS.NEW_PLAN) {
      [selectedDNDSchedule.current, counter.current] =
        generateInitialScheduleNoCoopCycle(
          academicYear,
          graduationYear,
          completedCourses
        );
    } else if (planOption === PLAN_OPTIONS.EXAMPLE_PLAN) {
      [selectedDNDSchedule.current, counter.current] =
        generateInitialScheduleFromExistingPlan(
          academicYear,
          graduationYear,
          major!.name,
          coopCycle!,
          allPlans
        );
    }

    await savePlan();
    prepareToClose();
  };

  const savePlan = async () => {
    const plan = await createPlanForUser(userId!, {
      name: planName!,
      link_sharing_enabled: false,
      schedule: selectedDNDSchedule.current!,
      catalog_year: catalogYear,
      major: major ? major.name : null,
      coop_cycle: coopCycle,
      concentration: concentration,
      course_counter: counter.current,
    });
    addNewPlan(plan.plan, academicYear);
  };

  const openModal = (): void => setVisible(true);

  const prepareToClose = () => {
    setVisible(false);
    resetForm();
  };

  const renderPlanName = () => {
    const error = errorsVisible && errors.planName;

    return (
      <TextField
        id="outlined-basic"
        label="Plan Name"
        variant="outlined"
        value={planName || ""}
        onChange={(event) => setValues({ planName: event.target.value })}
        placeholder="Plan 1"
        error={!!error}
        helperText={error}
      />
    );
  };

  const renderCatalogYearDropdown = () => {
    const catalogYears: number[] = [
      ...Array.from(new Set(allMajors.map((maj) => maj.yearVersion))),
    ];

    return (
      <Autocomplete
        style={{ marginTop: "10px", marginBottom: "5px" }}
        disableListWrap
        options={catalogYears}
        getOptionLabel={(catalogYear) => catalogYear.toString()}
        value={catalogYear}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Catalog Year"
            fullWidth
          />
        )}
        onChange={(e, value) => {
          setValues({
            catalogYear: value,
            major: null,
            coopCycle: null,
          });
        }}
      />
    );
  };

  const renderMajorDropDown = () => {
    return (
      <Autocomplete
        disableListWrap
        options={allMajors.filter((maj) => maj.yearVersion === catalogYear)}
        getOptionLabel={(maj) => maj.name}
        value={major}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Major" fullWidth />
        )}
        onChange={(e, value) => {
          setValues({
            major: value,
            concentration: null,
            coopCycle: null,
          });
        }}
      />
    );
  };

  const renderConcentrationDropDown = () => {
    return (
      <SaveInParentConcentrationDropdown
        major={major || undefined}
        concentration={concentration}
        setConcentration={(value: string | null) =>
          setValues({ concentration: value })
        }
        setError={setNoConcentrationError}
        showError={errorsVisible}
        useLabel={true}
      />
    );
  };

  const renderCoopCycleDropDown = () => {
    return (
      <Autocomplete
        disableListWrap
        options={allPlans[major!.name].map((p) => planToString(p))}
        value={coopCycle}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select A Co-op Cycle"
            fullWidth
          />
        )}
        onChange={(e, value) => {
          setValues({ coopCycle: value });
          if (!value && planOption === PLAN_OPTIONS.EXAMPLE_PLAN)
            setValues({ planOption: null });
        }}
      />
    );
  };

  const renderSelectOptions = () => {
    const setSelect = (e: any) => {
      setValues({ planOption: e.target.value });
    };

    const error = errorsVisible && errors.planOption;

    return (
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label" error={!!error}>
          Create Plan Based On
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          labelWidth={160}
          onChange={setSelect}
          displayEmpty
          value={planOption}
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
          error={!!error}
        >
          <MenuItem value={PLAN_OPTIONS.NEW_PLAN}>
            {PLAN_OPTIONS.NEW_PLAN}
          </MenuItem>
          {coopCycle && (
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
        <FormHelperText error={!!error}>{error}</FormHelperText>
      </FormControl>
    );
  };

  useEffect(() => {
    if (planOption === PLAN_OPTIONS.EXISTING_PLAN && basePlan) {
      const plan = userPlans.find((schedule) => schedule.name === basePlan)!;
      setValues({
        catalogYear: plan.catalogYear,
        major:
          findMajorFromName(plan.major, allMajors, plan.catalogYear) || null,
        concentration: plan.concentration || null,
        coopCycle: plan.coopCycle || "",
      });
      selectedDNDSchedule.current = plan.schedule;
      counter.current = plan.courseCounter;
    }
  }, [basePlan]);

  const renderBasePlan = () => {
    const error = errorsVisible && errors.basePlan;

    return (
      <FormControl>
        <Autocomplete
          disableListWrap
          options={scheduleNames}
          value={basePlan}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Select One of Your Plans"
              fullWidth
              error={!!error}
              helperText={error}
            />
          )}
          onChange={(e, value) => {
            setValues({ basePlan: value });
          }}
        />
      </FormControl>
    );
  };

  return isFetchingMajors || isFetchingPlans ? (
    <SpinnerWrapper>
      <Puff
        color="#f50057"
        height={100}
        width={100}
        // timeout={5000} //5 secs
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
            {!!catalogYear && renderMajorDropDown()}
            {!!major && renderConcentrationDropDown()}
            {!!major && renderCoopCycleDropDown()}
            {renderSelectOptions()}
            {planOption === PLAN_OPTIONS.UPLOAD_PLAN ? (
              <ExcelUpload setSchedule={setSchedule} />
            ) : planOption === PLAN_OPTIONS.EXISTING_PLAN ? (
              renderBasePlan()
            ) : null}
          </FieldContainer>
          <NextButton text="Submit" onClick={onSubmit} />
        </InnerSection>
      </Modal>
      <RedColorButton onClick={() => openModal()}>+ Add Plan</RedColorButton>
    </>
  );
};

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
