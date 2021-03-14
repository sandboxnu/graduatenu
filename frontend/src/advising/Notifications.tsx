import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { INotification } from "../models/types";
import { fetchNotifications } from "../services/NotificationService";
import styled from "styled-components";

const Container = styled.div`
  margin: 30px;
  border: 1px solid red;
  border-radius: 10px;
  width: auto;
  padding: 20px;
`;

const NotificationsContainer: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    setNotifications(fetchNotifications());
  }, []);

  const notificationComponents = notifications.map((notif: INotification) => (
    <Notification
      author={notif.author}
      text={notif.text}
      planId={notif.planId}
      userId={notif.userId}
    />
  ));

  return (
    <Container>
      {notifications.length == 0 ? (
        <p> You have no notifications left! </p>
      ) : (
        notificationComponents
      )}
    </Container>
  );
};

const Notification: React.FC<INotification> = (props: INotification) => {
  const { author, text, planId, userId } = props;
  return (
    <div>
      <p>{author}</p>
      <p>{text}</p>
      <p>{planId}</p>
      <p>{userId}</p>
    </div>
  );
};

export const NotificationsPage = withRouter(NotificationsContainer);
