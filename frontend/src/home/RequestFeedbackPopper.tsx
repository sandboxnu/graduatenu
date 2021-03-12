import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { Button, TextField, Tooltip } from "@material-ui/core";
import { DefaultModal } from "../components/common/DefaultModal";
import styled from "styled-components";
import { Autocomplete } from "@material-ui/lab";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { getAdvisors } from "../services/AdvisorService";
import { IAbrAdvisor } from "../models/types";
import { getActivePlanFromState, getStudentFromState } from "../state";
import { AppState } from "../state/reducers/state";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import { requestApproval } from "../services/PlanService";
import { WhiteColorButton } from "../components/common/ColoredButtons";
import { NORTHEASTERN_RED } from "../constants";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const SCHEDULE_APPOINTMENT_LINK =
  "https://northeastern.campus.eab.com/student/appointments/new";

const SubTitle = styled.div`
  font-size: 14px;
  color: gray;
  text-align: center;
  margin-bottom: 20px;
`;

const AdvisorDropdownContainer = styled.div`
  margin-top: 0px;
  margin-bottom: 20px;
  width: 300px;
`;

const ButtonContainer = styled.div`
  margin-top: 5px;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StepNumber = styled.div`
  color: ${NORTHEASTERN_RED}
  font-size: 20px;
  font-weight: 800;
  margin: 10px;
`;

const StepText = styled.div`
  font-size: 20px;
  margin-top: 10px;
`;

const StepLink = styled.a`
  font-size: 20px;
  color: ${NORTHEASTERN_RED}
  text-decoration: none
  &:visited: {
    color: ${NORTHEASTERN_RED}
  }
  &:hover: {
    text-decoration: underline
  }
`;

const EMPTY_ADVISOR_LIST: IAbrAdvisor[] = [];

export const RequestFeedbackPopper: React.FC = () => {
  const { currentSchedule, approvedSchedule, planId, userId } = useSelector(
    (state: AppState) => ({
      currentSchedule: getActivePlanFromState(state).schedule,
      approvedSchedule: getActivePlanFromState(state).approvedSchedule,
      planId: getActivePlanFromState(state).id,
      userId: getStudentFromState(state).id,
    })
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [isApproved, setIsApproved] = useState(
    JSON.stringify(currentSchedule) == JSON.stringify(approvedSchedule)
  );
  const [advisors, setAdvisors] = useState(EMPTY_ADVISOR_LIST);
  const [
    isScheduledAppointmentChecked,
    setIsScheduleAppointmentChecked,
  ] = useState(false);

  useDebouncedEffect(
    () =>
      setIsApproved(
        JSON.stringify(currentSchedule) == JSON.stringify(approvedSchedule)
      ),
    1000,
    [currentSchedule, approvedSchedule]
  );

  useEffect(() => {
    getAdvisors()
      .then(response => setAdvisors(response.advisors))
      .catch(err => console.log(err));
  }, []);

  const findAdvisorEmail = (name: string): string => {
    let advisorEmail = "";
    advisors.forEach((advisor: IAbrAdvisor) => {
      if (advisor.fullName === name) {
        advisorEmail = advisor.email;
        return;
      }
    });
    return advisorEmail;
  };

  const ApprovalStatusButton = () => {
    const icon = isApproved ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />;
    const text = isApproved ? "Approved" : "Request Feedback";
    const tooltipText = isApproved
      ? "An advisor thinks your plan looks great! If you make any changes, you can request additional feedback."
      : "Send a request for an advisor to provide feedback for your plan.";

    return (
      <Tooltip title={tooltipText} aria-label="request-button">
        <div>
          <WhiteColorButton
            variant="contained"
            startIcon={icon}
            disabled={isApproved}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            {text}
          </WhiteColorButton>
        </div>
      </Tooltip>
    );
  };

  const AdvisorDropdown = () => {
    return (
      <AdvisorDropdownContainer>
        <Autocomplete
          style={{ marginTop: "10px", marginBottom: "5px" }}
          disableListWrap
          options={advisors.map((advisor: IAbrAdvisor) => advisor.fullName)}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Advisor"
              fullWidth
            />
          )}
          value={selectedAdvisor}
          onChange={(_, value) => {
            setSelectedAdvisor(value || "");
          }}
        />
      </AdvisorDropdownContainer>
    );
  };

  const RequestApprovalButton = () => {
    return (
      <ButtonContainer>
        <PrimaryButton
          disabled={selectedAdvisor === "" || !isScheduledAppointmentChecked}
          onClick={async () => {
            await requestApproval(
              userId,
              findAdvisorEmail(selectedAdvisor),
              planId
            );
            setIsOpen(false);
          }}
        >
          Request Approval
        </PrimaryButton>
      </ButtonContainer>
    );
  };

  const handleChange = (event: any) => {
    setIsScheduleAppointmentChecked(event.target.checked);
  };

  return (
    <>
      <DefaultModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Request Feedback"
      >
        <SubTitle>
          Schedule an academic advising appointment with your advisor, and then
          send over your plan for feedback before your appointment.
        </SubTitle>
        <StepContainer>
          <StepNumber> 1. </StepNumber>
          <StepText>
            {" "}
            Schedule an appointment with your advisor{" "}
            <StepLink target="_blank" href={SCHEDULE_APPOINTMENT_LINK}>
              here
            </StepLink>
          </StepText>
        </StepContainer>
        <StepContainer>
          <StepNumber> 2. </StepNumber>
          <StepText>
            {" "}
            Select the advisor you made an appointment with below{" "}
          </StepText>
        </StepContainer>
        <AdvisorDropdown />
        <FormControlLabel
          control={
            <Checkbox
              checked={isScheduledAppointmentChecked}
              onChange={handleChange}
              name="checkedA"
            />
          }
          label="I scheduled an appointment with my advisor"
        />
        <RequestApprovalButton />
      </DefaultModal>
      <ApprovalStatusButton />
    </>
  );
};
