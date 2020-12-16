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
import { IUserDataAbr } from "../models/types";
import { getActivePlanFromState, getUserFromState } from "../state";
import { AppState } from "../state/reducers/state";
import { useDebouncedEffect } from "../utils/useDebouncedEffect";
import { sendEmail } from "../services/EmailService";

const SubTitle = styled.div`
  font-size: 14px;
  color: gray;
  text-align: center;
`;

const AdvisorDropdownContainer = styled.div`
  margin-top: 20px;
  width: 300px;
`;

const EMPTY_ADVISOR_LIST: IUserDataAbr[] = [];

export const RequestFeedbackPopper: React.FC = () => {
  const { currentSchedule, approvedSchedule, planId, email } = useSelector(
    (state: AppState) => ({
      currentSchedule: getActivePlanFromState(state).schedule,
      approvedSchedule: getActivePlanFromState(state).approvedSchedule,
      planId: getActivePlanFromState(state).id,
      email: getUserFromState(state).email,
    })
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [isApproved, setIsApproved] = useState(
    JSON.stringify(currentSchedule) == JSON.stringify(approvedSchedule)
  );
  const [advisors, setAdvisors] = useState(EMPTY_ADVISOR_LIST);

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
    advisors.forEach((advisor: IUserDataAbr) => {
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
          <Button
            variant="contained"
            startIcon={icon}
            disabled={isApproved}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            {text}
          </Button>
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
          options={advisors.map((advisor: IUserDataAbr) => advisor.fullName)}
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
      <PrimaryButton
        disabled={selectedAdvisor === ""}
        onClick={async () => {
          // Todo: Trigger backend API call
          await sendEmail(email, findAdvisorEmail(selectedAdvisor), planId);
          setIsOpen(false);
        }}
      >
        Request Approval
      </PrimaryButton>
    );
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
          We'll send over an email to you and your advisor to let them know your
          plan is awaiting feedback. You'll get an email when you have feedback
          from your advisor. WIP COPY
        </SubTitle>
        <AdvisorDropdown />
        <RequestApprovalButton />
      </DefaultModal>
      <ApprovalStatusButton />
    </>
  );
};
