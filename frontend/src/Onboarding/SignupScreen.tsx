import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import styled from "styled-components";
import { PrimaryButton } from "../components/common/PrimaryButton";
import * as Yup from "yup";
import { TextField } from "@material-ui/core";
import { ErrorOutlineSharp } from "@material-ui/icons";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Title = styled.div`
  margin-top: 96px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const Subtitle = styled.div`
  margin-top: 8px;
  margin-bottom: 2px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  width: 326px;
`;

const StyledField = styled(Field)`
  border: 1px solid white;
  width: 500px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const SignupValidation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .max(255)
    .required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const SignupForm = () => {
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupValidation}
      onSubmit={values => {
        // same shape as initial values
        console.log(values);
      }}
    >
      {({ errors, touched, values, handleChange }) => (
        <Form>
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            value={values.email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={"Je;llo"}
          />
          {console.log(touched)}
          {/* <Field type="text" name="email"/> */}

          {/* {errors.email && touched.email && <div>{errors.email}</div>} */}

          <Field name="password" />
          {errors.password && touched.password && <div>{errors.password}</div>}

          <Field name="confirmPassword" />
          {errors.confirmPassword && touched.confirmPassword && (
            <div>{errors.confirmPassword}</div>
          )}
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

const SignupScreen = () => {
  return (
    <Wrapper>
      <Title>Sign Up</Title>

      {SignupForm()}

      <Subtitle>
        Already a member? Log in{" "}
        <Link
          style={{ color: "#EB5757" }}
          to={{
            pathname: "/login",
          }}
        >
          here
        </Link>
        {" or "}
        <Link style={{ color: "#EB5757" }} to="/home">
          continue as guest
        </Link>
      </Subtitle>
      <div onClick={() => console.log("Hello")}>
        <PrimaryButton>Sign Up</PrimaryButton>
      </div>
    </Wrapper>
  );
};

export default SignupScreen;
