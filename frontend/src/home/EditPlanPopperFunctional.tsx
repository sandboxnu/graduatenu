import React, { useDebugValue, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { batch, useDispatch, useSelector } from "react-redux";
import Popper from "@material-ui/core/Popper";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Button, Tooltip } from "@material-ui/core";
import { EditPlanIconButtonProps } from "./EditPlanIconButton";
import styled from "styled-components";
import { AppState } from "../state/reducers/state";
import { Dispatch } from "redux";
import { DNDSchedule } from "../models/types";
import {
  getAcademicYearFromState,
  getActivePlanFromState,
  getGraduationYearFromState,
  getUserIdFromState,
  getUserPrimaryPlanIdFromState,
} from "../state";
import { IPlanData } from "../models/types";
import { Major, Schedule } from "../../../common/types";
import {
  getMajorsFromState,
  getPlansFromState,
  getTakenCreditsFromState,
  getUserFullNameFromState,
  safelyGetActivePlanCatalogYearFromState,
} from "../state";
import {
  alterScheduleToHaveCorrectYears,
  clearSchedule,
  generateInitialScheduleFromExistingPlan,
  getStandingFromCompletedCourses,
  planToString,
  scheduleHasClasses,
} from "../utils";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
  setActivePlanCoopCycleAction,
  setActivePlanMajorAction,
  setActivePlanDNDScheduleAction,
  setCurrentClassCounterForActivePlanAction,
  setActivePlanCatalogYearAction,
} from "../state/actions/userPlansActions";
import { SaveOnChangeConcentrationDropdown } from "../components/ConcentrationDropdown";
import { setPrimaryPlan } from "../services/PlanService";
import {
  SnackbarAlert,
  ALERT_STATUS,
} from "../components/common/SnackbarAlert";

const PlanPopper = styled(Popper)<any>`
  margin-top: 4px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditProfileLink = styled(Link)`
  font-size: 0.8em;
  color: #eb5757;
  &:focus,
  &:visited,
  &:link {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PlanCard = styled.div<any>`
  width: 266px;
  height: auto;
  background: #ffffff;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.12),
    0px 0px 2px rgba(0, 0, 0, 0.14);
  padding: 16px;
`;

const NameText = styled.p`
  font-weight: 500;
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 5px;
`;

const StandingText = styled.p`
  font-weight: normal;
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 5px;
`;

const MajorTextField = styled(TextField)<any>`
  font-size: 10px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  height: 40px;
`;

const SetButton = styled(Button)<any>`
  background: #e0e0e0;
  font-weight: normal;
  float: right;
`;

const Divider = styled.hr`
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 1em 0;
  padding: 0;
`;

const EditPlanPopperComponent: React.FC = () => {
  const dispatch = useDispatch();
  const {
    plan,
    majors,
    allPlans,
    creditsTaken,
    userFullName,
    userId,
    primaryPlanId,
    academicYear,
    graduationYear,
  } = useSelector((state: AppState) => ({
    plan: getActivePlanFromState(state)!, // EditPlanPopper is only visible if there is an active plan
    majors: getMajorsFromState(state),
    allPlans: getPlansFromState(state),
    creditsTaken: getTakenCreditsFromState(state),
    userFullName: getUserFullNameFromState(state),
    userId: getUserIdFromState(state),
    primaryPlanId: getUserPrimaryPlanIdFromState(state),
    academicYear: getAcademicYearFromState(state)!,
    graduationYear: getGraduationYearFromState(state)!,
  }));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [name, setName] = useState<string>(userFullName);
  const [catalogYear, setCatalogYear] = useState<number | null>(
    plan.catalogYear
  );

  const handleIconButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl === null) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handleOnClickAway = () => {
    setAnchorEl(null);
  };

  const ProfileInfo = () => {
    return (
      <>
        <TopRow>
          <NameText>{name}</NameText>
          <EditProfileLink to="/profile">Edit Profile</EditProfileLink>
        </TopRow>
        <StandingText>
          {getStandingFromCompletedCourses(creditsTaken)}
        </StandingText>
        <StandingText>{creditsTaken + " Credits Completed"}</StandingText>
      </>
    );
  };

  const EditName = () => {
    return (
      <TextField
        style={{ marginTop: "10px", marginBottom: "5px" }}
        id="outlined-basic"
        label="Plan Name"
        variant="outlined"
        onChange={e => setName(e.target.value)}
        defaultValue={userFullName}
        fullWidth
      />
    );
  };

  const EditCatalogYear = () => {
    let catalogYears = [
      ...Array.from(new Set(majors.map(maj => maj.yearVersion.toString()))),
    ];
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
        value={catalogYear ? catalogYear + "" : ""}
        onChange={(_, value) => {
          if (value === "") {
            setCatalogYear(null);
          } else {
            setCatalogYear(Number(value));
          }
        }}
      />
    );
  };

  return (
    <div>
      <EditPlanIconButtonProps onClick={handleIconButtonClick} />
      <PlanPopper
        id={"simple-popper"}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <ClickAwayListener onClickAway={handleOnClickAway}>
          <PlanCard>
            <ProfileInfo />
            <Divider />
            <EditName />
            <EditCatalogYear />
          </PlanCard>
        </ClickAwayListener>
      </PlanPopper>
    </div>
  );
};

export const EditPlanPopper = withRouter(EditPlanPopperComponent);
