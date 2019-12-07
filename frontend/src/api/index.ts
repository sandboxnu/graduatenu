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
      query: `{ 
        class(subject: "${subject}", classId: ${classId}) {
          latestOccurrence {
            name
            subject
            classId
            maxCredits
            minCredits
            prereqs
            coreqs
          }
        }
      }`,
    }),
  });
  const json = await response.json();

  if (
    json &&
    json.data &&
    json.data.class &&
    json.data.class.latestOccurrence
  ) {
    const course: ScheduleCourse = json.data.class.latestOccurrence;
    course.numCreditsMax = json.data.class.latestOccurrence.maxCredits;
    course.numCreditsMin = json.data.class.latestOccurrence.minCredits;
    delete json.data.class.latestOccurrence.maxCredits;
    delete json.data.class.latestOccurrence.minCredits;
    return course;
  } else {
    return null;
  }
};
