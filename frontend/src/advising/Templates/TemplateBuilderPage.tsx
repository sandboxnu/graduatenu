import React, { useEffect, useState } from "react";
import { EditableSchedule } from "../../components/Schedule/ScheduleComponents";
import { useHistory, useParams } from "react-router";
import {
  deleteTemplatePlan,
  fetchTemplate,
} from "../../services/TemplateService";
import { useSelector, shallowEqual, useDispatch, batch } from "react-redux";
import {
  getActivePlanFromState,
  getActivePlanNameFromState,
  getAdvisorUserIdFromState,
} from "../../state";
import { AppState } from "../../state/reducers/state";
import {
  addNewPlanAction,
  setActivePlanNameAction,
} from "../../state/actions/userPlansActions";
import { LoadingScreen } from "../../components/common/FullPageLoading";
import styled from "styled-components";
import { AutoSavePlan } from "../../home/AutoSavePlan";
import { WhiteColorButton } from "../../components/common/ColoredButtons";
import { Close as CloseIcon } from "@material-ui/icons";
import { IconButton, TextField } from "@material-ui/core";
import { AssignUserToTemplateModal } from "./AssignUserToTemplateModal";
import { ITemplatePlan } from "../../models/types";
import { createPlanForUser } from "../../services/PlanService";
import { fetchUser, IAbrStudent } from "../../services/AdvisorService";
import { alterScheduleToHaveCorrectYears } from "../../utils";
import { EditPlanButton } from "../../home/EditPlanButton";
import CheckIcon from "@material-ui/icons/Check";

const TitleText = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  justify-content: center;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
`;

const PlanHeader = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  max-height: 50px;
`;

const ICONBUTTON_HEIGHT = 30;

interface ParamProps {
  templateId: string;
}

export const TemplateBuilderPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const planName = useSelector((state: AppState) =>
    getActivePlanNameFromState(state)
  );

  const routeParams = useParams<ParamProps>();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState(planName);
  const [templateData, setTemplateData] = useState<ITemplatePlan | null>(null);
  const [isEditPlanName, setIsEditPlanName] = useState(false);
  const id = Number(routeParams.templateId);
  const { userId, activePlan } = useSelector(
    (state: AppState) => ({
      userId: getAdvisorUserIdFromState(state),
      activePlan: getActivePlanFromState(state),
    }),
    shallowEqual
  );

  useEffect(() => {
    setTemplateName(planName);
  }, [planName]);

  const assignTemplate = async (
    student: IAbrStudent,
    shouldDelete: boolean
  ) => {
    try {
      const userId = student.id;
      const userInfo = await fetchUser(userId);
      if (userInfo.error) return;
      const schedule =
        userInfo.user.graduationYear && userInfo.user.academicYear
          ? alterScheduleToHaveCorrectYears(
              JSON.parse(JSON.stringify(activePlan.schedule)),
              userInfo.user.academicYear,
              userInfo.user.graduationYear
            )
          : activePlan.schedule;

      const planResponse = await createPlanForUser(userId, {
        name: templateName ? templateName : "",
        link_sharing_enabled: false,
        schedule: schedule,
        catalog_year: templateData!.catalogYear,
        major: templateData!.major,
        coop_cycle: templateData!.coopCycle,
        course_counter: templateData!.courseCounter,
        concentration: templateData!.concentration,
      });
      if (planResponse.error) {
        setLoadingError("Something went wrong with assigning this plan");
        return;
      } else if (shouldDelete) {
        const deleteResponse = await deleteTemplatePlan(
          userId,
          templateData!.id
        );
        if (!deleteResponse.error) {
          setLoadingError("Something went wrong with deleting the template");
          return;
        }
      }
      history.push("/advisor/templates");
    } catch (error) {
      setLoadingError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchTemplate(userId, id)
      .then(response => {
        if (response.error) {
          setLoadingError(response.error);
        } else if (response.templatePlan.schedule) {
          setTemplateData(response.templatePlan);
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

  const confirmEditPlanName = (name: string | undefined) => {
    if (name) {
      dispatch(setActivePlanNameAction(name));
      setIsEditPlanName(false);
    }
  };

  return loading || loadingError ? (
    <LoadingScreen
      text="Loading your plan"
      errorMsg={loadingError || undefined}
    />
  ) : (
    <>
      {isEditPlanName ? (
        // show input field if in edit plan name mode
        <PlanHeader>
          <TextField
            id="outlined-basic"
            label={"Plan Name"}
            variant="outlined"
            value={templateName}
            onChange={event => setTemplateName(event.target.value)}
            placeholder=""
            style={{ width: "326px" }}
            InputProps={{ style: { fontSize: 20 } }}
          />
          {/* confirm button */}
          <IconButton
            style={{ padding: 3, height: ICONBUTTON_HEIGHT }}
            onClick={() => confirmEditPlanName(templateName)}
          >
            <CheckIcon />
          </IconButton>
          {/* cancel button */}
          <IconButton
            style={{ padding: 3, height: ICONBUTTON_HEIGHT }}
            onClick={() => setIsEditPlanName(false)}
          >
            <CloseIcon />
          </IconButton>
        </PlanHeader>
      ) : (
        // just show plan name with edit icon if not editting
        <PlanHeader>
          <TitleText>{planName}</TitleText>
          <EditPlanButton
            onClick={() => setIsEditPlanName(true)}
          ></EditPlanButton>
        </PlanHeader>
      )}
      <ButtonContainer>
        <AutoSavePlan isTemplate />
        <WhiteColorButton
          style={{ margin: 10 }}
          onClick={() => setOpenModal(true)}
        >
          Assign Template
        </WhiteColorButton>
        <IconButton
          style={{ padding: 3, height: ICONBUTTON_HEIGHT }}
          onClick={() => history.push("/advisor/templates")}
        >
          <CloseIcon />
        </IconButton>
      </ButtonContainer>
      <AssignUserToTemplateModal
        isOpen={openModal}
        closeModal={() => setOpenModal(false)}
        onClose={assignTemplate}
      />
      <EditableSchedule
        collapsibleYears
        sidebarPresent
        hasGenericCourse={true}
      ></EditableSchedule>
    </>
  );
};
