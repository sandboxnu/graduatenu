import React, { useEffect, useState } from "react";
import { useDispatch, shallowEqual, useSelector } from "react-redux";
import { ToastProvider } from "react-toast-notifications";
import { Home } from "./Home";
import { LoadingScreen } from "../components/common/FullPageLoading";
import { getAcademicYearFromState, getUserIdFromState } from "../state";
import { AppState } from "../state/reducers/state";
import { setUserPlansAction } from "../state/actions/userPlansActions";
import { getAuthToken } from "../utils/auth-helpers";
import { findAllPlansForUser } from "../services/PlanService";
import { IPlanData } from "../models/types";

export const HomeWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const token = getAuthToken();

  const { userId, academicYear } = useSelector(
    (state: AppState) => ({
      userId: getUserIdFromState(state),
      academicYear: getAcademicYearFromState(state)!,
    }),
    shallowEqual
  );

  useEffect(() => {
    setIsLoading(true);
    findAllPlansForUser(userId, token).then((plans: IPlanData[]) => {
      dispatch(setUserPlansAction(plans, academicYear));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        text="Getting GraduateNU ready"
        subText="Don't worry, it'll take just a second"
      />
    );
  } else {
    return (
      <ToastProvider placement="bottom-right" autoDismissTimeout={10000}>
        <Home />
      </ToastProvider>
    );
  }
};
