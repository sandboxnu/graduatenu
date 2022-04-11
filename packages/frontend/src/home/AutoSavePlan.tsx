import * as React from "react";
import { debounce } from "lodash";
import { batch, useDispatch, useSelector } from "react-redux";
import { IPlanData, ITemplatePlan, IUpdateTemplatePlan } from "../models/types";
import { updatePlanForUser } from "../services/PlanService";
import {
  setActivePlanStatusAction,
  updateActivePlanTimestampAction,
} from "../state/actions/userPlansActions";
import { useCallback, useEffect, useRef } from "react";
import { convertPlanToUpdatePlanData } from "../utils/plan-helpers";
import {
  getActivePlanFromState,
  getActivePlanStatusFromState,
  getAdvisorUserIdFromState,
  getUserIdFromState,
} from "../state";
import { AppState } from "../state/reducers/state";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import LoopIcon from "@material-ui/icons/Loop";
import styled from "styled-components";
import * as timeago from "timeago.js";
import { updateTemplatePlanForUser } from "../services/TemplateService";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DEBOUNCE_SAVE_DELAY_MS = 750;

export const AutoSavePlan: React.FC<{
  isTemplate?: boolean;
}> = ({ isTemplate }) => {
  const dispatch = useDispatch();
  const { activePlanStatus, activePlan, userId } = useSelector(
    (state: AppState) => ({
      activePlanStatus: getActivePlanStatusFromState(state),
      activePlan: getActivePlanFromState(state),
      userId: isTemplate
        ? getAdvisorUserIdFromState(state)
        : getUserIdFromState(state),
    })
  );

  const debouncedUpdate = useCallback(
    debounce(async (activePlan) => {
      isTemplate
        ? await updateTemplatePlan(activePlan as ITemplatePlan)
        : await updatePlan(activePlan);
    }, DEBOUNCE_SAVE_DELAY_MS),
    []
  );

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    dispatch(setActivePlanStatusAction("Waiting to Update"));
    debouncedUpdate(activePlan);
  }, [
    JSON.stringify(activePlan.schedule),
    activePlan.coopCycle,
    activePlan.major,
    activePlan.concentration,
    activePlan.name,
    activePlan.catalogYear,
    debouncedUpdate,
  ]);

  const updatePlan = async (activePlan: IPlanData) => {
    dispatch(setActivePlanStatusAction("Updating"));
    await updatePlanForUser(
      userId,
      activePlan.id,
      convertPlanToUpdatePlanData(activePlan, userId)
    ).then((response) => {
      batch(() => {
        dispatch(updateActivePlanTimestampAction(response.plan.updatedAt));
        dispatch(setActivePlanStatusAction("Up To Date"));
      });
    });
  };

  const updateTemplatePlan = async (activePlan: ITemplatePlan) => {
    dispatch(setActivePlanStatusAction("Updating"));
    await updateTemplatePlanForUser(
      userId,
      activePlan.id,
      activePlan as IUpdateTemplatePlan
    ).then((response) => {
      batch(() => {
        dispatch(
          updateActivePlanTimestampAction(response.templatePlan.updatedAt)
        );
        dispatch(setActivePlanStatusAction("Up To Date"));
      });
    });
  };

  if (
    activePlanStatus === "Waiting to Update" ||
    activePlanStatus === "Updating"
  ) {
    return (
      <Container>
        Saving... <LoopIcon style={{ paddingLeft: 6 }} />
      </Container>
    );
  }

  return (
    <Container>
      Last edit was {timeago.format(activePlan.updatedAt)}
      <CheckCircleOutlineIcon style={{ fill: "green", paddingLeft: 6 }} />
    </Container>
  );
};
