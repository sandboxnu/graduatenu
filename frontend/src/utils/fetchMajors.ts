import {
  fetchMajorsPendingAction,
  fetchMajorsSuccessAction,
  fetchMajorsErrorAction,
} from "../state/actions/majorsActions";
import { Dispatch } from "redux";
import { Major } from "../models/types";
import { majorIds } from "../majors";

const majorSchema: string[] = majorIds.map((majorId: string) => {
  return `major(majorId: "${majorId}") {
        latestOccurrence {
            requirements
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

export function fetchMajors() {
  return (dispatch: Dispatch) => {
    dispatch(fetchMajorsPendingAction());
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
        dispatch(fetchMajorsSuccessAction(majors));
        return majors;
      })
      .catch(error => {
        dispatch(fetchMajorsErrorAction(error));
      });
  };
}
