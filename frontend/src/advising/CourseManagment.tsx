import React, { useState, useEffect } from "react";
import { GraduateHeader } from "../components/common/GraduateHeader";
import { resetStudentAction } from "../state/actions/studentActions";
import { removeAuthTokenFromCookies } from "../utils/auth-helpers";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

export const CourseManagmentPage: React.FC = () => {
  const dispatch = useDispatch();

  return <GraduateHeader />;
};
