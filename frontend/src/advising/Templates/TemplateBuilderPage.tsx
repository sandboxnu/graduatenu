import React, { useEffect, useState } from "react";
import { EditableSchedule } from "../../components/Schedule/ScheduleComponents";
import { useHistory, useParams } from "react-router";
import { fetchTemplate } from "../../services/TemplateService";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getAdvisorUserIdFromState } from "../../state";
import { AppState } from "../../state/reducers/state";
import { addNewPlanAction } from "../../state/actions/userPlansActions";
import { LoadingScreen } from "../../components/common/FullPageLoading";

interface ParamProps {
  templateId: string;
}

export const TemplateBuilderPage = () => {
  const dispatch = useDispatch();
  const routeParams = useParams<ParamProps>();
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
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

  return loading ? (
    <LoadingScreen
      text="Loading your plan"
      subText="Don't worry, it'll take just a second"
    />
  ) : loadingError ? (
    <LoadingScreen errorMsg={loadingError} />
  ) : (
    <EditableSchedule collapsibleYears sidebarPresent></EditableSchedule>
  );
};
