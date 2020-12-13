import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { approvePlan } from "../services/PlanService";

const NotificationsComponent: React.FC = (props: any) => {
  const dispatch = useDispatch();
  approvePlan(3, 2, {}).then(response => console.log(response));
  return <div></div>;
};

export const NotificationsPage = withRouter(NotificationsComponent);
