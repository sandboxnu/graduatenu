import React, { useState } from "react";
import styled from "styled-components";
import { Modal, TextField } from "@material-ui/core";
import { PrimaryButton } from '../components/common/PrimaryButton';
import { IUpdateUserPassword } from "../models/types";
import { updatePassword } from "../services/UserService"

const OuterContainer = styled.div`
  width: 30%;
  margin: 0 auto;
  outline: none;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 50%;
  padding: 0px 30px 30px 30px;
  background: #ffffff;
  box-shadow: 10px 10px 16px -10px rgba(0,0,0,0.75);
  outline: none;
`;

const Spacer = styled.div`
  height: 20px;
`;

const ButtonContainer = styled.div`
  position: relative;
  margin-left:auto; 
  margin-right:0;
`;

const changePassword = (
  token: string, 
  oldPassword: string, 
  newPassword: string, 
  confirmPassword: string, 
  setError: (error: string) => void, 
  setOpen: (isOpen: boolean) => void) => {
  const changePasswordBody: IUpdateUserPassword = {
    old_password: oldPassword,
    new_password: newPassword,
    confirm_password: confirmPassword
  }
  updatePassword(token, changePasswordBody).then(response => {
    setError(response.error);
    if (response.error === undefined) {
      setOpen(false)
    }
  });
}

export function ChangePasswordModal (props: any) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const passwordLengthErrorText = newPassword.length > 0 && newPassword.length < 6 ? "Must be atleast 6 characters" : "";
    const confirmPasswordErrorText = newPassword === confirmPassword ? "" : "Passwords don't match";
  
    return (
          <Modal
              disableAutoFocus={true}
              open={props.open}
              onClose={() => props.setOpen(false)}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
          >
            <OuterContainer>
              <InnerContainer>
                  <h2 id="simple-modal-title">Change Password</h2>
                  <TextField
                    id="outlined-basic"
                    type="password"
                    variant="outlined"
                    value={oldPassword}
                    error = {error != null && error.length !== 0 && error === "Unauthorized" }
                    onChange={e => setOldPassword(e.target.value)}
                    helperText={error != null && error.length !== 0 && error === "Unauthorized" ? "Wrong Password": "" }
                    placeholder="Old Password"
                  />
                  <Spacer/>
                  <TextField
                    id="outlined-basic"
                    type="password"
                    variant="outlined"
                    error = {passwordLengthErrorText.length === 0 ? false: true }
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    helperText={passwordLengthErrorText}
                  />
                  <Spacer/>
                  <TextField
                    id="outlined-basic"
                    type="password"
                    variant="outlined"
                    error = {confirmPasswordErrorText.length === 0 ? false: true }
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    helperText={confirmPasswordErrorText}
                  />
                  <ButtonContainer>
                      <PrimaryButton
                        onClick={() => changePassword(props.token, oldPassword, newPassword, confirmPassword, setError, props.setOpen)}
                        disabled={confirmPasswordErrorText.length !== 0 
                        || newPassword.length === 0 
                        || oldPassword.length === 0}>
                        Change 
                      </PrimaryButton>
                  </ButtonContainer>
              </InnerContainer>
            </OuterContainer>
          </Modal>
    );
}
