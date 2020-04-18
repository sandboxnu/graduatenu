import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { TextField, Button } from "@material-ui/core";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;

const Title = styled.div`
  margin-top: 96px;
  font-family: ".Helvetica Neue DeskInterface";
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const Subtitle = styled.div`
  margin-top: 8px;
  margin-bottom: 0;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
`;

const Box = styled.div`
  border: 1px solid white;
  width: 500px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

interface SignupScreenProps {}

interface SignupScreenState {
  emailStr: string;
  passwordStr: string;
  confirmPasswordStr: string;
  beenEditedEmail: boolean;
  beenEditedPassword: boolean;
  beenEditedConfirmPassword: boolean;
}

export class SignupScreenComponent extends React.Component<
  SignupScreenProps,
  SignupScreenState
> {
  constructor(props: SignupScreenProps) {
    super(props);

    this.state = {
      emailStr: "",
      passwordStr: "",
      confirmPasswordStr: "",
      beenEditedEmail: false,
      beenEditedPassword: false,
      beenEditedConfirmPassword: false,
    };
  }

  onChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      emailStr: e.target.value,
      beenEditedEmail: true,
    });
  }

  onChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      passwordStr: e.target.value,
      beenEditedPassword: true,
    });
  }

  onChangeConfirmPassword(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      confirmPasswordStr: e.target.value,
      beenEditedConfirmPassword: true,
    });
  }

  /**
   * Renders the email text field
   */
  renderEmailTextField(textFieldStr: string, beenEdited: boolean) {
    return (
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={textFieldStr}
        onChange={this.onChangeEmail.bind(this)}
        placeholder="presidentaoun@northeastern.edu"
        error={textFieldStr.length === 0 && beenEdited}
        style={{
          marginTop: 48,
          marginBottom: 0,
          minWidth: 326,
        }}
        helperText={
          (" H " && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid email")
        }
        type="email"
      />
    );
  }

  /**
   * Renders the password text field
   */
  renderPasswordTextField(textFieldStr: string, beenEdited: boolean) {
    return (
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        value={textFieldStr}
        onChange={this.onChangePassword.bind(this)}
        error={textFieldStr.length === 0 && beenEdited}
        style={{
          marginTop: "16px",
          marginBottom: 0,
          minWidth: 326,
        }}
        helperText={
          (" H " && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid name")
        }
        type="password"
      />
    );
  }

  /**
   * Renders the confirm password text field
   */
  renderConfirmPasswordTextField(textFieldStr: string, beenEdited: boolean) {
    return (
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        value={textFieldStr}
        onChange={this.onChangeConfirmPassword.bind(this)}
        error={textFieldStr.length === 0 && beenEdited}
        style={{
          marginTop: "16px",
          marginBottom: 0,
          minWidth: 326,
        }}
        helperText={
          (" H " && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid name")
        }
        type="password"
      />
    );
  }

  render() {
    return (
      <Wrapper>
        <Title>Sign Up</Title>
        <Box>
          {this.renderEmailTextField(
            this.state.emailStr,
            this.state.beenEditedEmail
          )}
          {this.renderPasswordTextField(
            this.state.passwordStr,
            this.state.beenEditedPassword
          )}
          {this.renderConfirmPasswordTextField(
            this.state.confirmPasswordStr,
            this.state.beenEditedConfirmPassword
          )}
        </Box>

        <Subtitle>
          Already a member? Log in <a href="#">here</a> or{" "}
          <a href="#">continue as guest</a>
        </Subtitle>
        <Button
          variant="contained"
          color="secondary"
          style={{
            maxWidth: "100px",
            maxHeight: "36px",
            minWidth: "100px",
            minHeight: "36px",
            backgroundColor: "#EB5757",
            marginTop: "26px",
            marginBottom: 12,
          }}
        >
          Sign Up
        </Button>
      </Wrapper>
    );
  }
}
