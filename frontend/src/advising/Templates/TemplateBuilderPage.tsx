import React, { useEffect, useState } from "react";
import { EditableSchedule } from "../../components/Schedule/ScheduleComponents";
import { useHistory, useParams } from "react-router";
import { fetchTemplate } from "../../services/TemplateService";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getAdvisorUserIdFromState } from "../../state";
import { AppState } from "../../state/reducers/state";
import { addNewPlanAction } from "../../state/actions/userPlansActions";
import { LoadingScreen } from "../../components/common/FullPageLoading";
import styled from "styled-components";
import { AutoSavePlan } from "../../home/AutoSavePlan";
import { WhiteColorButton } from "../../components/common/ColoredButtons";
import { Close as CloseIcon } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const TitleText = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
`;

interface ParamProps {
  templateId: string;
}

export const TemplateBuilderPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const routeParams = useParams<ParamProps>();
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string | null>(null);
  const id = Number(routeParams.templateId);
  const { userId } = useSelector(
    (state: AppState) => ({
      userId: getAdvisorUserIdFromState(state),
    }),
    shallowEqual
  );

  useEffect(() => {
    fetchTemplate(userId, id)
      .then(response => {
        if (response.error) {
          setLoadingError(response.error);
        } else if (response.templatePlan.schedule) {
          dispatch(addNewPlanAction(response.templatePlan));
          setTemplateName(response.templatePlan.name);
        } else {
          setLoadingError(
            "There does not seem to be a schedule linked to this plan. Please try creating a new plan."
          );
        }
        setLoading(false);
      })
      .catch(error => {
        setLoadingError(
          "There was an error fetching your plan. Try and refresh!"
        );
        setLoading(false);
      });
  }, []);

  return loading || loadingError ? (
    <LoadingScreen
      text="Loading your plan"
      errorMsg={loadingError || undefined}
    />
  ) : (
    <>
      <TitleText>{templateName}</TitleText>
      <ButtonContainer>
        <AutoSavePlan isTemplate />
        <WhiteColorButton style={{ margin: 10 }}>
          Assign Template
        </WhiteColorButton>
        <IconButton
          style={{ padding: 3, height: 30 }}
          onClick={() => history.push("/advisor/templates")}
        >
          <CloseIcon />
        </IconButton>
      </ButtonContainer>
      <EditableSchedule collapsibleYears sidebarPresent></EditableSchedule>
    </>
  );
};
