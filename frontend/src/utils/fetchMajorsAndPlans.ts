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
import { Major, Schedule } from "../../../common/types";
import { majorIds } from "../majors";
import { History } from "history";

//graphql schema for searchNEU's majors endpoint.
const majorSchema: string[] = majorIds.map(({ majorId, year }) => {
  return `major(majorId: "${majorId}") {
        occurrence(year: ${year}) {
            spec
            plansOfStudy
        }
    }`;
});

// build a GraphQL query
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

//parse out major objects from the response.
const parseMajors = (res: any): Major[] => {
  const majors: Major[] = [];
  Object.values(res).forEach((value: any) => {
    if (value) {
      majors.push(value.occurrence.spec);
    }
  });
  return majors;
};

//parse out plan objects from the response.
const parsePlans = (res: any): Record<string, Schedule[]> => {
  const record: Record<string, Schedule[]> = {};
  Object.values(res).forEach((value: any) => {
    if (value) {
      record[value.occurrence.spec.name] = value.occurrence.plansOfStudy;
    }
  });
  return record;
};

//use fetch utility to make a post request to the searchNEU graphql api endpoint.
export function fetchMajorsAndPlans(history: History<unknown>) {
  return (dispatch: Dispatch) => {
    return new Promise<Major[]>((resolve, reject) => {
      dispatch(fetchMajorsPendingAction());
      dispatch(fetchPlansPendingAction());
      fetch("https://api.searchneu.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: querySchema }),
      })
        .then(res => {
          return {
            data: res.json(),
            statusCode: res.status,
          };
        })
        .then(res => {
          if (res.statusCode >= 400) {
            history.replace(history.location.pathname, {
              errorStatusCode: res.statusCode,
            });
          }
          return res.data;
        })
        .then(res => {
          const majors: Major[] = parseMajors(res.data);
          const record: Record<string, Schedule[]> = parsePlans(res.data);
          dispatch(fetchMajorsSuccessAction(majors));
          dispatch(fetchPlansSuccessAction(record));
          resolve(majors);
        })
        .catch(error => {
          dispatch(fetchMajorsErrorAction(error));
          dispatch(fetchPlansErrorAction(error));
        });
    });
  };
}
