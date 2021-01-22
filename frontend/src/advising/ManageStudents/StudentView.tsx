import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IPlanData, IUserData } from "../../models/types";
import { fetchUser } from "../../services/AdvisorService";
import { findAllPlansForUser } from "../../services/PlanService";
import {
  safelyGetActivePlanIdFromState,
  getActivePlanNameFromState,
} from "../../state";
import { setUserPlansAction } from "../../state/actions/userPlansActions";
import { AppState } from "../../state/reducers/state";
import styled from "styled-components";
import { Avatar, Tooltip, IconButton } from "@material-ui/core";
import { ArrowBack, Fullscreen } from "@material-ui/icons";
import Edit from "@material-ui/icons/Edit";
import { RedColorButton } from "../../components/common/ColoredButtons";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { NonEditableSchedule } from "../../components/Schedule/ScheduleComponents";
import { SwitchPlanList } from "../../components/SwitchPlan/SwitchPlanList";
import { PlanTitle, ButtonHeader, ScheduleWrapper, Container } from "./Shared";
import { useHistory, useParams } from "react-router";

const StudentViewContainer = styled.div`
  display: flex;
  justify-content: center;
  > * {
    border: 1px solid red;
    border-radius: 10px;
    height: 70vh;
    padding: 30px;
  }
  * {
    font-family: Roboto;
    font-style: normal;
  }
`;

const SchedulePreviewContainer = styled.div`
  overflow: hidden;
  flex: 5;
`;

const StudentInfoContainer = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const NoPlanContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const StudentInfoDisplay = styled.div`
  height: 100%;
`;

const AvatarWrapper = styled.div`
  height: 25%;
  > * {
    background-color: #d3898d !important;
    color: #fff !important;
    font-size: 5vw !important;
    margin: 0% 10% !important;
    width: 80% !important;
    height: 100% !important;
  }
`;

const StudentInfoTextWrapper = styled.div`
  height: 30%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  > * {
  }
`;
const Text = styled.div`
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
`;
const NameText = styled.div`
  line-height: 28px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;
const TitleText = styled.div`
  font-size: 24px;
  line-height: 20px;
  font-weight: 500;
`;
const PlanText = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 28px;
`;
const PlanListContainer = styled.div`
  width: 100%;
  height: 30%;
  overflow: hidden;
  &:hover {
    overflow-y: auto;
  }
`;
const ButtonContainer = styled.div`
  margin: 5% 0%;
  justify-content: center;
  display: flex;
`;

interface ParamProps {
  id: string;
}

export const StudentView: React.FC = () => {
  const history = useHistory();
  const routeParams = useParams<ParamProps>();
  const id = Number(routeParams.id);
  const [fetchingStudent, setFetchingStudent] = useState(true);
  const [student, setStudent] = useState<IUserData | null>(null);
  const [noPlans, setNoPlans] = useState(false);

  const dispatch = useDispatch();
  const { planName, planId } = useSelector((state: AppState) => ({
    planName: getActivePlanNameFromState(state),
    planId: safelyGetActivePlanIdFromState(state),
  }));

  useEffect(() => {
    fetchUser(id).then(response => {
      setStudent(response.user);
      setFetchingStudent(false);
    });
    findAllPlansForUser(id).then((plans: IPlanData[]) => {
      dispatch(setUserPlansAction(plans, 2020));
      if (!plans || !plans.length || !plans[0].schedule) setNoPlans(true);
    });
  }, []);

  const renderStudentInfo = () => {
    return (
      <StudentInfoContainer>
        {!student && !fetchingStudent ? (
          <NoPlanContainer>
            <Text>User Has No Plans</Text>
          </NoPlanContainer>
        ) : fetchingStudent ? (
          <LoadingSpinner isTall />
        ) : (
          <StudentInfoDisplay>
            <AvatarWrapper>
              <Avatar>{student!.fullName[0]}</Avatar>
            </AvatarWrapper>
            <StudentInfoTextWrapper>
              <NameText>{student!.fullName}</NameText>
              <Text>{student!.email}</Text>
              <Text>{student!.major}</Text>
              <Text>{student!.coopCycle}</Text>
            </StudentInfoTextWrapper>

            <PlanText>Plans:</PlanText>
            <PlanListContainer>
              <SwitchPlanList />
            </PlanListContainer>
            <ButtonContainer>
              <RedColorButton onClick={() => {}}>
                Assign Template
              </RedColorButton>
            </ButtonContainer>
          </StudentInfoDisplay>
        )}
      </StudentInfoContainer>
    );
  };

  const renderSchedule = () => {
    return (
      <SchedulePreviewContainer>
        {noPlans ? (
          <NoPlanContainer>
            <Text>User Has No Plans</Text>
          </NoPlanContainer>
        ) : (
          <>
            <PlanTitle>
              <TitleText>{planName}</TitleText>
            </PlanTitle>
            <ButtonHeader>
              <Tooltip title="Edit this student's plan">
                <IconButton
                  onClick={() =>
                    history.push(
                      `/advisor/manageStudents/${
                        student!.id
                      }/expanded/${planId!}?edit=true`
                    )
                  }
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <IconButton
                onClick={() =>
                  history.push(
                    `/advisor/manageStudents/${student!.id}/expanded/${planId!}`
                  )
                }
              >
                <Fullscreen />
              </IconButton>
            </ButtonHeader>
            <ScheduleWrapper>
              <NonEditableSchedule />
            </ScheduleWrapper>
          </>
        )}
      </SchedulePreviewContainer>
    );
  };

  return (
    <Container>
      <IconButton onClick={() => history.push(`/advisor/manageStudents`)}>
        <ArrowBack />
      </IconButton>
      <StudentViewContainer>
        {renderStudentInfo()}
        {renderSchedule()}
      </StudentViewContainer>
    </Container>
  );
};
