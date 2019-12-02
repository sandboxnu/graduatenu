import { ScheduleCourse } from "../models/types";

export const fetchCourse = async (
  subject: string,
  classId: string
): Promise<ScheduleCourse | null> => {
  if (subject.length < 2 || classId.length !== 4 || isNaN(+classId)) {
    return null;
  }

  const response = await fetch("https://searchneu.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{ class(subject: "${subject}", classId: ${classId}) {
          name
          subject
          classId
        }
      }`,
    }),
  });
  const json = (await response.json()).data.class;

  if (json == null) {
    return null;
  }

  json.numCreditsMin = 4;
  json.numCreditsMax = 4;
  return json;
};
