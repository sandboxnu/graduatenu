import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import {
  EditableSchedule,
  NonEditableScheduleStudentView,
} from "../../components/Schedule/ScheduleComponents";
import { AutoSavePlan } from "../../home/AutoSavePlan";
import { safelyGetActivePlanFromState } from "../../state";
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
import { useHistory, useLocation, useParams } from "react-router";
import { IUserData } from "../../models/types";
import { fetchUser } from "../../services/AdvisorService";
import { fetchPlan } from "../../services/PlanService";
import { getAuthToken } from "../../utils/auth-helpers";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { setUserAction } from "../../state/actions/userActions";

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

interface ParamProps {
  id: string; // id of the student
  planId: string; // id of the student's plan
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const ExpandedStudentView: React.FC = () => {
  const history = useHistory();
  const params = useParams<ParamProps>();
  const queryParams = useQuery();
  const id = Number(params.id);
  const planId = Number(params.planId);

  const [editMode, setEditMode] = useState(queryParams.get("edit") === "true");
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<IUserData | null>(null);

  const { plan } = useSelector((state: AppState) => ({
    plan: safelyGetActivePlanFromState(state),
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(expandAllYearsForActivePlanAction());

    fetchUser(id).then(response => {
      const user = response.user;

      fetchPlan(id, planId).then(response => {
        batch(() => {
          dispatch(setUserAction(user));
          dispatch(setUserPlansAction([response], user.academicYear));
          dispatch(setActivePlanAction(response.name, id, user.academicYear));
        });
        setStudent(user);
        setLoading(false);
      });
    });
  }, []);

  const onEditPress = () => setEditMode(!editMode);

  return (
    <Container>
      <FullScheduleViewContainer>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ExpandedScheduleStudentInfo>
              <IconButton
                onClick={() => history.push(`/advisor/manageStudents/${id}`)}
              >
                <ArrowBack />
              </IconButton>
              <b style={{ marginRight: 12 }}>{student!.fullName}</b>
              {plan!.major || ""} {plan!.coopCycle || ""}
            </ExpandedScheduleStudentInfo>
            <ExpandedStudentContainer>
              <PlanTitle>{plan!.name}</PlanTitle>
              <ButtonHeader>
                {editMode && <AutoSavePlan />}
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
                  onClick={() => history.push(`/advisor/manageStudents/${id}`)}
                >
                  <FullscreenExit />
                </IconButton>
              </ButtonHeader>
              <ScheduleWrapper>
                {editMode ? (
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
              </ScheduleWrapper>
            </ExpandedStudentContainer>
          </>
        )}
      </FullScheduleViewContainer>
    </Container>
  );
};
