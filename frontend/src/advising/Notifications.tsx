import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { updatePlanForUser } from "../services/PlanService";

const test = { approved_schedule: { test: 123 } };

const NotificationsComponent: React.FC = (props: any) => {
  const dispatch = useDispatch();
  updatePlanForUser(2, 1, test).then(response => console.log(response));
  return <div></div>;
};

export const NotificationsPage = withRouter(NotificationsComponent);
