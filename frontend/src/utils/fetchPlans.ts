import {
  fetchPlansPendingAction,
  fetchPlansSuccessAction,
  fetchPlansErrorAction,
} from "../state/actions/plansActions";
import { Dispatch } from "redux";
import { Schedule } from "../models/types";
import { majorIds, majorMap } from "../majors";

const planSchema: string[] = majorIds.map((majorId: string) => {
  return `major(majorId: "${majorId}") {
          latestOccurrence {
              plansOfStudy
          }
      }`;
});

// build the query schema
const querySchema: string = `
  query {
  ${planSchema.reduce(
    (accumulator: string, currentValue: string, index: number) => {
      return accumulator + `major${String(index)}: ${currentValue}\n`;
    },
    ""
  )}
  }
  `;

const parsePlans = (res: any): Record<string, Schedule[]> => {
  const record: Record<string, Schedule[]> = {};
  Object.keys(res).forEach((key, index) => {
    if (res.hasOwnProperty(key)) {
      record[majorMap[majorIds[index]]] =
        res[key].latestOccurrence.plansOfStudy;
      index++;
    }
  });
  return record;
};

export function fetchPlans() {
  return (dispatch: Dispatch) => {
    dispatch(fetchPlansPendingAction());
    fetch("https://searchneu.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: querySchema }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }
        const record: Record<string, Schedule[]> = parsePlans(res.data);
        dispatch(fetchPlansSuccessAction(record));
        return record;
      })
      .catch(error => {
        dispatch(fetchPlansErrorAction(error));
      });
  };
}
