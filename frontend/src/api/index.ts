import {
  ScheduleCourse,
  INEUAndPrereq,
  INEUOrPrereq,
} from "../../../common/types";

interface SearchClass {
  name: string;
  classId: string;
  subject: string;
  prereqs?: INEUAndPrereq | INEUOrPrereq;
  coreqs?: INEUAndPrereq | INEUOrPrereq;
  maxCredits: number;
  minCredits: number;
}

export const fetchCourse = async (
  subject: string,
  classId: string
): Promise<ScheduleCourse | null> => {
  if (subject.length < 2 || classId.length !== 4 || isNaN(+classId)) {
    return null;
  }

  const response = await fetch("https://api.searchneu.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{ 
        class(subject: "${subject}", classId: "${classId}") {
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

export const searchCourses = async (
  searchQuery: string,
  minIndex: number = 0,
  maxIndex: number = 9999
): Promise<ScheduleCourse[]> => {
  const courses: ScheduleCourse[] = [];
  const response = await fetch("https://api.searchneu.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
      {
        search(termId:202130, query: "${searchQuery}", classIdRange: {min: ${minIndex}, max: ${maxIndex}}) {
           totalCount 
           pageInfo { hasNextPage } 
           nodes { ... on ClassOccurrence { name subject maxCredits minCredits prereqs coreqs classId
          } 
        } 
      } 
    }`,
    }),
  });

  const results = await response.json();
  results.data.search.nodes.forEach((result: SearchClass) => {
    const course: ScheduleCourse = {
      name: result.name,
      classId: result.classId,
      subject: result.subject,
      prereqs: result.prereqs,
      coreqs: result.coreqs,
      numCreditsMin: result.minCredits,
      numCreditsMax: result.maxCredits,
      semester: null,
    };
    courses.push(course);
  });

  return courses;
};
