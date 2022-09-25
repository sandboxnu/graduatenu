import Axios, { AxiosInstance, Method } from "axios";
import {
  CreatePlanDto,
  SignUpStudentDto,
  GetPlanResponse,
  GetStudentResponse,
  INEUAndPrereq,
  INEUOrPrereq,
  LoginStudentDto,
  ScheduleCourse,
  UpdatePlanDto,
  UpdatePlanResponse,
  UpdateStudentDto,
  UpdateStudentResponse,
  OnboardStudentDto,
  ScheduleCourse2,
} from "@graduate/common";
import { ClassConstructor, plainToInstance } from "class-transformer";

class APIClient {
  private axios: AxiosInstance;

  private async req<T>(
    method: Method,
    url: string,
    responseClass?: ClassConstructor<T>,
    body?: any,
    params?: any,
    headers?: any
  ): Promise<T> {
    const res = (
      await this.axios.request({ method, url, data: body, params, headers })
    ).data;
    return responseClass ? plainToInstance(responseClass, res) : res;
  }

  constructor(baseURL = "/api") {
    this.axios = Axios.create({
      baseURL: baseURL,
      headers: { "content-type": "application/json" },
    });
  }

  auth = {
    login: (body: LoginStudentDto): Promise<GetStudentResponse> =>
      this.req("POST", "/auth/login", GetStudentResponse, body),
    register: (body: SignUpStudentDto): Promise<GetStudentResponse> =>
      this.req("POST", "/auth/register", GetStudentResponse, body),
    logout: (): Promise<GetStudentResponse> => this.req("GET", "/auth/logout"),
  };

  student = {
    update: (body: UpdateStudentDto): Promise<UpdateStudentResponse> =>
      this.req("PATCH", "/students/me", UpdateStudentResponse, body),
    onboard: (body: OnboardStudentDto): Promise<UpdateStudentResponse> =>
      this.req("PATCH", "/students/me/onboard", UpdateStudentResponse, body),
    getMe: (): Promise<GetStudentResponse> =>
      this.req("GET", "/students/me", GetStudentResponse),
    getMeWithPlan: (): Promise<GetStudentResponse> =>
      this.req("GET", "/students/me", GetStudentResponse, undefined, {
        isWithPlans: true,
      }),
    delete: (): Promise<void> => this.req("DELETE", "students/me"),
  };

  plans = {
    create: (body: CreatePlanDto): Promise<GetPlanResponse> =>
      this.req("POST", "/plans", GetPlanResponse, body),
    get: (id: string | number): Promise<GetPlanResponse> =>
      this.req("GET", `/plans/${id}`, GetPlanResponse),
    update: (
      id: string | number,
      body: UpdatePlanDto
    ): Promise<UpdatePlanResponse> =>
      this.req("PATCH", `/plans/${id}`, UpdatePlanResponse, body),
    delete: (id: string | number): Promise<void> =>
      this.req("DELETE", `/plans/${id}`),
  };
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

interface ClassResult {
  latestOccurrence: SearchClass | null;
}

/**
 * A client for interacting with the Search API. Allows us to fetch and search
 * for courses.
 */
class SearchAPIClient {
  private axios: AxiosInstance;

  constructor(baseURL = "https://api.searchneu.com/graphql") {
    this.axios = Axios.create({ baseURL: baseURL });
  }

  fetchCourse = async (
    subject: string,
    classId: string
  ): Promise<ScheduleCourse2<null> | null> => {
    const res = await this.axios({
      method: "post",
      data: {
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
      },
    });

    const courseData = await res.data.data;
    if (courseData?.class?.latestOccurrence) {
      const course: ScheduleCourse2<null> = courseData.class.latestOccurrence;
      course.numCreditsMax = courseData.class.latestOccurrence.maxCredits;
      course.numCreditsMin = courseData.class.latestOccurrence.minCredits;
      delete courseData.class.latestOccurrence.maxCredits;
      delete courseData.class.latestOccurrence.minCredits;
      return course;
    } else {
      return null;
    }
  };

  batchFetchCourses = async (
    classes: { subject: string; classId: string }[]
  ): Promise<Record<string, ScheduleCourse2<null>> | null> => {
    const baseQuery = `fragment CourseInfo on Class {
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
    query AllCourses {\n`;

    if (classes.length === 0) {
      return {};
    }

    let classQueries = classes.map(({ subject, classId }) => {
      return `${subject}${classId}: class(subject: "${subject}", classId:"${classId}") {... CourseInfo}`;
    });

    const finalQuery = baseQuery + classQueries.join("\n") + "\n}";

    const res = await this.axios({
      method: "post",
      data: {
        query: finalQuery,
      },
    });

    console.log(finalQuery);

    // Check that we have the data we're expecting (checking for the first
    // class that we requested).
    if (
      res?.data?.data[classes[0].subject + classes[0].classId] === undefined
    ) {
      return null;
    }

    const courseData: Record<string, ScheduleCourse2<null>> = {};
    const data = await res.data;

    Object.entries(data.data).forEach((entry) => {
      const key = entry[0];
      const value = entry[1] as ClassResult;
      if (value === null || value.latestOccurrence === null) {
        return;
      }

      const classData = value.latestOccurrence;
      const course: ScheduleCourse2<null> = {
        name: classData.name,
        classId: classData.classId,
        subject: classData.subject,
        numCreditsMax: classData.maxCredits,
        numCreditsMin: classData.minCredits,
        prereqs: classData.prereqs,
        coreqs: classData.coreqs,
        id: null,
      };
      courseData[key] = course;
    });

    // const courseData = await res.data.data;
    return courseData;

    // const courseData = await res.data.data;
    // if (courseData?.class?.latestOccurrence) {
    //   const course: ScheduleCourse2<null> = courseData.class.latestOccurrence;
    //   course.numCreditsMax = courseData.class.latestOccurrence.maxCredits;
    //   course.numCreditsMin = courseData.class.latestOccurrence.minCredits;
    //   delete courseData.class.latestOccurrence.maxCredits;
    //   delete courseData.class.latestOccurrence.minCredits;
    //   return course;
    // } else {
    //   return null;
    // }
  };

  searchCourses = async (
    searchQuery: string,
    minIndex = 0,
    maxIndex = 9999
  ): Promise<ScheduleCourse2<null>[]> => {
    const res = await this.axios({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        query: `
        {
          search(termId:"202130", query: "${searchQuery}", classIdRange: {min: ${minIndex}, max: ${maxIndex}}) {
            totalCount 
            pageInfo { hasNextPage } 
            nodes { ... on ClassOccurrence { name subject maxCredits minCredits prereqs coreqs classId
            } 
          } 
        } 
      }`,
      }),
    });

    const coursesData = await res.data;
    const nodes = coursesData.data.search.nodes;

    const courses = nodes.map((result: SearchClass) => {
      return {
        name: result.name,
        classId: result.classId,
        subject: result.subject,
        prereqs: result.prereqs,
        coreqs: result.coreqs,
        numCreditsMin: result.minCredits,
        numCreditsMax: result.maxCredits,
        semester: null,
      };
    });

    return courses;
  };
}

export const API = new APIClient();
export const SearchAPI = new SearchAPIClient();
