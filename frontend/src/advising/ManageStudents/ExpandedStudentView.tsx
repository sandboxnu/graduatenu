import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, batch, shallowEqual } from "react-redux";
import {
  EditableSchedule,
  NonEditableScheduleStudentView,
} from "../../components/Schedule/ScheduleComponents";
import { AutoSavePlan } from "../../home/AutoSavePlan";
import {
  getActivePlanStatusFromState,
  getAdvisorUserIdFromState,
  safelyGetActivePlanFromState,
} from "../../state";
import {
  expandAllYearsForActivePlanAction,
  setActivePlanAction,
  setUserPlansAction,
} from "../../state/actions/userPlansActions";
import { AppState } from "../../state/reducers/state";
import { IconButton, Tooltip } from "@material-ui/core";
import { ArrowBack, Check, FullscreenExit } from "@material-ui/icons";
import Edit from "@material-ui/icons/Edit";
import styled from "styled-components";
import { PlanTitle, ButtonHeader, ScheduleWrapper, Container } from "./Shared";
import { Prompt, useHistory, useLocation, useParams } from "react-router";
import { IUserData } from "../../models/types";
import { fetchUser } from "../../services/AdvisorService";
import { Comments } from "../../components/Schedule/Comments";
import {
  approvePlanForUser,
  fetchPlan,
  updatePlanLastViewed,
} from "../../services/PlanService";
import IdleTimer from "react-idle-timer";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { setUserAction } from "../../state/actions/userActions";
import { Alert } from "@material-ui/lab";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import {
  ALERT_STATUS,
  SnackbarAlert,
} from "../../components/common/SnackbarAlert";
import ScheduleChangeTracker from "../../utils/ScheduleChangeTracker";
import { sendChangeLog } from "../../services/PlanService";

const FullScheduleViewContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  * {
    font-family: Roboto;
    font-style: normal;
  }
`;

const ExpandedScheduleStudentInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ExpandedStudentContainer = styled.div`
  margin-top: 12px;
  border: 1px solid red;
  border-radius: 10px;
  padding: 30px;
`;

const PlanActionButtonContainer = styled.div`
  float: right;
  padding-right: 30px;
`;

const AlertWrapper = styled.div`
  margin: 12px 0px 12px 0px;
`;

interface ParamProps {
  id: string; // id of the student
  planId: string; // id of the student's plan
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VIEWING_BUFFER = 30000; // 30 seconds
const TIMEOUT = 900000; // 15 minutes

export const ExpandedStudentView: React.FC = () => {
  let interval: number | null = null;

  const history = useHistory();
  const params = useParams<ParamProps>();
  const queryParams = useQuery();
  const studentId = Number(params.id);
  const planId = Number(params.planId);

  const [editMode, setEditMode] = useState(queryParams.get("edit") === "true");
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<IUserData | null>(null);
  const [alertStatus, setAlertStatus] = useState<ALERT_STATUS>(
    ALERT_STATUS.None
  );

  const { plan, activePlanStatus, advisorId } = useSelector(
    (state: AppState) => ({
      plan: safelyGetActivePlanFromState(state),
      activePlanStatus: getActivePlanStatusFromState(state),
      advisorId: getAdvisorUserIdFromState(state),
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(expandAllYearsForActivePlanAction());

    fetchUser(studentId)
      .then(response => {
        const user = response.user;
        fetchPlan(studentId, planId)
          .then(response => {
            callUpdatePlanLastViewedOnInterval();
            batch(() => {
              dispatch(setUserAction(user));
              dispatch(setUserPlansAction([response], user.academicYear));
              dispatch(
                setActivePlanAction(response.name, studentId, user.academicYear)
              );
            });
            setStudent(user);
            setLoading(false);
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));

    const sendPlanUpdates = () => {
      const changes = ScheduleChangeTracker.getInstance().getChanges();
      if (changes !== "") {
        sendChangeLog(planId, studentId, advisorId, changes);
        ScheduleChangeTracker.getInstance().clearChanges();
      }
    };

    window.addEventListener("beforeunload", sendPlanUpdates);

    return function cleanup() {
      sendPlanUpdates();
      window.removeEventListener("beforeunload", sendPlanUpdates);
    };
  }, []);

  const callUpdatePlanLastViewedOnInterval = () => {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      if (plan && student) {
        updatePlanLastViewed(student.id, plan.id, advisorId);
      }
    }, VIEWING_BUFFER);
  };

  const shouldBlockNavigation = () => {
    return activePlanStatus !== "Up To Date";
  };

  const onEditPress = () => setEditMode(!editMode);

  const onIdle = () => {
    alert("You are now idle. The page will now refresh.");
    window.location.reload();
  };

  const approvePlan = () => {
    approvePlanForUser(studentId, planId, plan?.schedule)
      .then(() => setAlertStatus(ALERT_STATUS.Success))
      .catch(() => setAlertStatus(ALERT_STATUS.Error));
  };

  return (
    <>
      <IdleTimer
        element={document}
        onIdle={onIdle}
        debounce={250}
        timeout={TIMEOUT}
      />
      <Prompt
        when={shouldBlockNavigation()}
        message="You have unsaved changes, are you sure you want to leave?"
      />
      <Container>
        <FullScheduleViewContainer>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <ExpandedScheduleStudentInfo>
                <IconButton
                  onClick={() =>
                    history.push(`/advisor/manageStudents/${studentId}`)
                  }
                >
                  <ArrowBack />
                </IconButton>
                <b style={{ marginRight: 12 }}>{student!.fullName}</b>
                {plan!.major || ""} {plan!.coopCycle || ""}
              </ExpandedScheduleStudentInfo>
              {plan!.isCurrentlyBeingEditedByStudent && (
                <AlertWrapper>
                  <Alert severity="warning">
                    This plan is currently being edited by {student!.fullName},
                    so we've put it in read-only mode. You will be able to edit
                    it again once {student!.fullName} finishes making changes.
                  </Alert>
                </AlertWrapper>
              )}
              <ExpandedStudentContainer>
                <PlanTitle>{plan!.name}</PlanTitle>
                <ButtonHeader>
                  {editMode && !plan!.isCurrentlyBeingEditedByStudent && (
                    <AutoSavePlan />
                  )}
                  {editMode ? (
                    <Tooltip title="Finished Editing">
                      <IconButton onClick={onEditPress}>
                        <Check />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Edit this student's plan">
                      <IconButton onClick={onEditPress}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    onClick={() =>
                      history.push(`/advisor/manageStudents/${studentId}`)
                    }
                  >
                    <FullscreenExit />
                  </IconButton>
                </ButtonHeader>
                <ScheduleWrapper>
                  {editMode && !plan!.isCurrentlyBeingEditedByStudent ? (
                    <EditableSchedule
                      transferCreditPresent
                      collapsibleYears={false}
                    />
                  ) : (
                    <NonEditableScheduleStudentView
                      transferCreditPresent
                      collapsibleYears={false}
                    />
                  )}
                  <Comments planId={planId} studentId={studentId} />
                </ScheduleWrapper>
                <PlanActionButtonContainer>
                  <PrimaryButton onClick={() => approvePlan()}>
                    {" "}
                    Approve{" "}
                  </PrimaryButton>
                </PlanActionButtonContainer>
              </ExpandedStudentContainer>
              <SnackbarAlert
                alertStatus={alertStatus}
                handleClose={() => setAlertStatus(ALERT_STATUS.None)}
                successMsg={"Approved"}
              />
            </>
          )}
        </FullScheduleViewContainer>
      </Container>
    </>
  );
};
