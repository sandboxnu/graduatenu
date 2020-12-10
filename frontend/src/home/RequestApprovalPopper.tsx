import React, { useState, useEffect, useRef } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { Button, TextField, Tooltip } from "@material-ui/core";
import { DefaultModal } from "../components/common/DefaultModal";
import styled from "styled-components";
import { Autocomplete } from "@material-ui/lab";
import { PrimaryButton } from "../components/common/PrimaryButton";
const SubTitle = styled.div`
  font-size: 14px;
  color: gray;
  text-align: center;
`;

const AdvisorDropdownContainer = styled.div`
  margin-top: 20px;
  width: 300px;
`;

export const RequestApprovalPopper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: isApproved should be set based on if this is an approved plan, and if it is, if there has been any changes to this plan.
  // isApproved might not even have to be a state val.
  const [isApproved, setIsApproved] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");

  const ApprovalStatusButton = () => {
    const icon = isApproved ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />;
    const text = isApproved ? "Approved" : "Request Approval";
    const tooltipText = isApproved
      ? "Plan approved by advisor. If you make any changes, you will have to get this plan re-approved."
      : "Send a request for an advisor to approve your plan.";

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
        disabled={selectedAdvisor !== ""}
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
        title="Request Approval"
      >
        <SubTitle>
          We'll send over an email to you and your advisor to let them know your
          plan is awaiting review. If a plan has been approved, you'll get an
          email letting you know it's been approved. when your plan get's
          approved, we will reset all previously approved plans as you can only
          have one approved plan at a time.
        </SubTitle>
        <AdvisorDropdown />
        <RequestApprovalButton />
      </DefaultModal>
      <ApprovalStatusButton />
    </>
  );
};
