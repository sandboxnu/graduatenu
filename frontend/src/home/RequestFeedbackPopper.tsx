import React, { useState, useEffect, useRef } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { Button, TextField, Tooltip } from "@material-ui/core";
import { DefaultModal } from "../components/common/DefaultModal";
import styled from "styled-components";
import { Autocomplete } from "@material-ui/lab";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { getAdvisors } from "../services/AdvisorService";
import { getAuthToken } from "../utils/auth-helpers";

const SubTitle = styled.div`
  font-size: 14px;
  color: gray;
  text-align: center;
`;

const AdvisorDropdownContainer = styled.div`
  margin-top: 20px;
  width: 300px;
`;

export const RequestFeedbackPopper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: isApproved should be set based on if this is an approved plan, and if it is, if there has been any changes to this plan.
  // isApproved might not even have to be a state val.
  const [isApproved, setIsApproved] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");

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
    getAdvisors(getAuthToken()).then(response => console.log(response));

    return (
      <AdvisorDropdownContainer>
        <Autocomplete
          style={{ marginTop: "10px", marginBottom: "5px" }}
          disableListWrap
          // TODO: Get list of advisors from backend
          options={["Bob", "Emily", "Charles", "Chuck"]}
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
        onClick={() => {
          // Todo: Trigger backend API call
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
