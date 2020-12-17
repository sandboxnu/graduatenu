import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { NonEditableSchedule } from "../components/Schedule/ScheduleComponents";
import { mockData } from "../data/mockData";

const NotificationsComponent: React.FC = (props: any) => {
  const dispatch = useDispatch();
  return (
    <div style={{ margin: 30 }}>
      <NonEditableSchedule></NonEditableSchedule>
    </div>
  );
};

export const NotificationsPage = withRouter(NotificationsComponent);
