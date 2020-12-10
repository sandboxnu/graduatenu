import {
  ScheduleCourse,
  INEUAndPrereq,
  INEUOrPrereq,
} from "../../../common/types";

interface SearchResult {
  type: string;
  class?: SearchClass;
}

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

export const searchCourses = async (
  searchQuery: string,
  minIndex: number = 0,
  maxIndex: number = 10
): Promise<ScheduleCourse[]> => {
  const courses: ScheduleCourse[] = [];
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const response = await fetch(
    proxyurl +
      `https://searchneu.com/search?query=${searchQuery}&termId=202130&minIndex=${minIndex}&maxIndex=${maxIndex}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const results = await response.json();
  results.forEach((result: SearchResult) => {
    if (result.type && result.type === "class" && result.class) {
      const course: ScheduleCourse = {
        name: result.class.name,
        classId: result.class.classId,
        subject: result.class.subject,
        prereqs: result.class.prereqs,
        coreqs: result.class.coreqs,
        numCreditsMin: result.class.minCredits,
        numCreditsMax: result.class.maxCredits,
      };
      courses.push(course);
    }
  });

  return courses;
};
