import {
  fetchPlansPendingAction,
  fetchPlansSuccessAction,
  fetchPlansErrorAction,
} from "../state/actions/plansActions";
import {
  fetchMajorsPendingAction,
  fetchMajorsSuccessAction,
  fetchMajorsErrorAction,
} from "../state/actions/majorsActions";
import { Dispatch } from "redux";
import { Major } from "../models/types";
import { majorIds, majorMap } from "../majors";
import { Schedule } from "../models/types";

const majorSchema: string[] = majorIds.map((majorId: string) => {
  return `major(majorId: "${majorId}") {
        latestOccurrence {
            requirements
            plansOfStudy
        }
    }`;
});

// build the query schema
const querySchema: string = `
query {
${majorSchema.reduce(
  (accumulator: string, currentValue: string, index: number) => {
    return accumulator + `major${String(index)}: ${currentValue}\n`;
  },
  ""
)}
}
`;

const parseMajors = (res: any): Major[] => {
  const majors: Major[] = [];
  for (const key of Object.keys(res)) {
    if (res.hasOwnProperty(key)) {
      majors.push(res[key].latestOccurrence.requirements);
    }
  }
  return majors;
};

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

export function fetchMajorsAndPlans() {
  return (dispatch: Dispatch) => {
    dispatch(fetchMajorsPendingAction());
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
        const majors: Major[] = parseMajors(res.data);
        const record: Record<string, Schedule[]> = parsePlans(res.data);
        dispatch(fetchMajorsSuccessAction(majors));
        dispatch(fetchPlansSuccessAction(record));
        return majors;
      })
      .catch(error => {
        dispatch(fetchMajorsErrorAction(error));
        dispatch(fetchPlansErrorAction(error));
      });
  };
}
