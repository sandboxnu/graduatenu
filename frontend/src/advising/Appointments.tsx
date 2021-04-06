import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { IAppointments } from "../models/types";
import { fetchAppointments } from "../services/AppointmentService";
import styled from "styled-components";
import { PrimaryButton, SecondaryButton } from "../components/common/PrimaryButton";

const Container = styled.div`
  margin: auto;
  width: 750px;
  padding: 20px;
`;

const Title = styled.p`
  font-size: 2em;
  font-weight: 600;
  margin-top -10px;
  margin-bottom: 25px;
`

const InnerContainer = styled.div`
  height: 75vh;
  overflow: scroll;
`

const AppointmentContainer = styled.div`
  border: 1px solid red;
  border-radius: 10px;
  padding-left: 30px;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-bottom: 40px;
  margin-right: 10px;
`

const InfoButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const ButtonsContainer = styled.div`
  display: flex;
  margin-right: 30px;
  height: 2em;
  margin-top: 0.5em;
`

const SpaceContainer = styled.div`
  width: 20px;
`

const UserPlanInfo = styled.div`
  display: flex;
  padding-top: -10px;
  margin-top: -15px;
`

const Divider = styled.div`
  border: 1px solid red;
  width: 0px;
  margin-left: 25px;
  margin-right: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
`

const UserInfo = styled.div`
  width: 150px;
`

const PlanInfo = styled.div`
  margin-top: 1.25em;
`

const InfoName = styled.p`
  font-size: 0.9em
  padding-top: 0px;
  padding-bottom: 0px;
  font-weight: 600;
  margin-top: 0px;
  margin-bottom: 0px;
`

const InfoSubText = styled.p`
  font-size: 0.5em
  padding-top: 0px;
  padding-bottom: 0px;
`

const AppointmentTime = styled.p`
  position: relative;
  text-align: right;
  font-size: 0.25em;
  top: -10px;
  right: 10px;
`

const AppointmentsContainer: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState<IAppointments[]>([]);

  useEffect(() => {
    fetchAppointments(2).then(response => {
      setAppointments(response);
    })
  }, []);

  const appointmentComponents = appointments.map((appt: IAppointments) => (
    <Appointment
      id={appt.id}
      studentId={appt.studentId}
      fullname={appt.fullname}
      email={appt.email}
      nuid={appt.nuid}
      major={appt.major}
      planId={appt.planId}
      planName={appt.planName}
      planMajor={appt.planMajor}
      appointmentTime={appt.appointmentTime}
    />
  ));

  return (
    <Container>
      <Title>
        Upcoming plan review appointments
      </Title>
      <InnerContainer>
        {appointments.length == 0 ? (
          <p> You have no appointments to review left! </p>
        ) : (
          appointmentComponents
        )}
      </InnerContainer>
    </Container>
  );
};

const Appointment: React.FC<IAppointments> = (props: IAppointments) => {
  const date = new Date(props.appointmentTime)
  const dateFormatter = new Intl.DateTimeFormat('en');
  return ( 
    <AppointmentContainer>
      <AppointmentTime> Appointment scheduled for {dateFormatter.format(date)} </AppointmentTime>
      <InfoButtonsContainer>
      <UserPlanInfo>
        <UserInfo>
          <InfoName>{props.fullname}</InfoName>
          <InfoSubText>{props.email}</InfoSubText>
          <InfoSubText>{props.nuid}</InfoSubText>
          <InfoSubText>{props.major}</InfoSubText>
        </UserInfo>
        <Divider/>
        <PlanInfo>
          <InfoName>{props.planName}</InfoName>
          <InfoSubText>{props.planMajor}</InfoSubText>
        </PlanInfo>
      </UserPlanInfo>
      <ButtonsContainer>
        <SecondaryButton onClick={() => console.log("test")}>
          Dismiss
        </SecondaryButton>
        <SpaceContainer/>
        <PrimaryButton onClick={() => console.log("test")}>
          Review
        </PrimaryButton>
      </ButtonsContainer>
      </InfoButtonsContainer>
    </AppointmentContainer>
  );
};

export const AppointmentsPage = withRouter(AppointmentsContainer);
