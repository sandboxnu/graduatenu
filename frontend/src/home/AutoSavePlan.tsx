import * as React from "react";
import { debounce } from "lodash";
import { batch, useDispatch, useSelector } from "react-redux";
import { IPlanData } from "../models/types";
import { updatePlanForUser } from "../services/PlanService";
import { getAuthToken } from "../utils/auth-helpers";
import {
  setActivePlanStatusAction,
  updateActivePlanAction,
} from "../state/actions/userPlansActions";
import { useCallback, useEffect } from "react";
import { convertPlanToCreatePlanData } from "../utils/plan-helpers";
import {
  getActivePlanFromState,
  getActivePlanStatusFromState,
  getUserIdFromState,
} from "../state";
import { AppState } from "../state/reducers/state";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import LoopIcon from "@material-ui/icons/Loop";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DEBOUNCE_SAVE_DELAY_MS = 1000;

export const AutoSavePlan: React.FC = () => {
  const dispatch = useDispatch();
  const { activePlanStatus, activePlan, userId } = useSelector(
    (state: AppState) => ({
      activePlanStatus: getActivePlanStatusFromState(state),
      activePlan: getActivePlanFromState(state),
      userId: getUserIdFromState(state),
    })
  );

  const debouncedUpdate = useCallback(
    debounce(async activePlan => {
      await updatePlan(activePlan);
    }, DEBOUNCE_SAVE_DELAY_MS),
    []
  );

  useEffect(() => {
    dispatch(setActivePlanStatusAction("Waiting to Update"));
    debouncedUpdate(activePlan);
  }, [
    JSON.stringify(activePlan.schedule),
    activePlan.coopCycle,
    activePlan.major,
    activePlan.name,
    debouncedUpdate,
  ]);

  const updatePlan = async (activePlan: IPlanData) => {
    const token = getAuthToken();
    dispatch(setActivePlanStatusAction("Updating"));
    await updatePlanForUser(
      userId,
      token,
      activePlan.id,
      convertPlanToCreatePlanData(activePlan)
    ).then(response => {
      batch(() => {
        dispatch(updateActivePlanAction(response.plan));
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
  if (activePlanStatus === "Up To Date") {
    return (
      <Container>
        All Changes Saved{" "}
        <CheckCircleOutlineIcon style={{ fill: "green", paddingLeft: 6 }} />
      </Container>
    );
  }
  return null;
};
