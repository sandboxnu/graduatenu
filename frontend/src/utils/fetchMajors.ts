import {
  fetchMajorsPendingAction,
  fetchMajorsSuccessAction,
  fetchMajorsErrorAction,
} from "../state/actions/majorsActions";
import { Dispatch } from "redux";
import { Major } from "../models/types";

const majorIds = [
  "computer-information-science/computer-science/bscs",
  "science/biochemistry/biochemistry-bs",
  "science/mathematics/mathematics-bs",
];

const generateQueryString = (majorIds: string[]): string => {
  let res: string = "";
  for (const { majorId, index } of majorIds.map((majorId, index) => ({
    majorId,
    index,
  }))) {
    res += `major${index}: major(majorId: ${majorId}) {
                                latestOccurrence {
                                    requirements
                                    }
                            }`;
  }
  return res;
};

const parseMajors = (res: object): Major[] => {
  const majors: Major[] = [];
  for (let key in res) {
    majors.push(res[key].latestOccurrence.requirements);
  }
  return majors;
};

function fetchMajors() {
  return (dispatch: Dispatch) => {
    const queryString: string = generateQueryString(majorIds);
    dispatch(fetchMajorsPendingAction());
    fetch("https://searchneu.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{${queryString}}`,
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }
        const majors: Major[] = parseMajors(res);
        dispatch(fetchMajorsSuccessAction(majors));
        return majors;
      })
      .catch(error => {
        dispatch(fetchMajorsErrorAction(error));
      });
  };
}

export default fetchMajors;
