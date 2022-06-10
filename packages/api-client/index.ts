import Axios, { AxiosInstance, Method } from "axios";
import {
  CreatePlanDto,
  CreateStudentDto,
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
} from "@graduate/common";
import { ClassConstructor, plainToInstance } from "class-transformer";

class APIClient {
  private axios: AxiosInstance;

  private async req<T>(
    method: Method,
    url: string,
    responseClass?: ClassConstructor<T>,
    headers?: any,
    body?: any,
    params?: any
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
      this.req("POST", "/auth/login", GetStudentResponse, undefined, body),
    register: async (body: CreateStudentDto): Promise<GetStudentResponse> =>
      this.req("POST", "/auth/register", GetStudentResponse, undefined, body),
  };

  student = {
    update: (
      body: UpdateStudentDto,
      jwt: string
    ): Promise<UpdateStudentResponse> =>
      this.req(
        "PATCH",
        "/students/me",
        UpdateStudentResponse,
        { Authorization: `Bearer ${jwt}` },
        body
      ),
    getMe: (jwt: string): Promise<GetStudentResponse> =>
      this.req("GET", "/students/me", GetStudentResponse, {
        Authorization: `Bearer ${jwt}`,
      }),
    getMeWithPlan: (jwt: string): Promise<GetStudentResponse> =>
      this.req(
        "GET",
        "students/me",
        GetStudentResponse,
        { Authorization: `Bearer ${jwt}` },
        undefined,
        { isWithPlans: true }
      ),
    delete: (jwt: string): Promise<void> =>
      this.req("DELETE", "students/me", undefined, {
        Authorization: `Bearer ${jwt}`,
      }),
  };

  plans = {
    create: (body: CreatePlanDto, jwt: string): Promise<GetPlanResponse> =>
      this.req(
        "POST",
        "/plans",
        GetPlanResponse,
        { Authorization: `Bearer ${jwt}` },
        body
      ),
    get: (id: string | number, jwt: string): Promise<GetPlanResponse> =>
      this.req("GET", `/plans/${id}`, GetPlanResponse, {
        Authorization: `Bearer ${jwt}`,
      }),
    update: (
      id: string | number,
      body: UpdatePlanDto,
      jwt: string
    ): Promise<UpdatePlanResponse> =>
      this.req(
        "PATCH",
        `/plans/${id}`,
        UpdatePlanResponse,
        { Authorization: `Bearer ${jwt}` },
        body
      ),
    delete: async (id: string | number, jwt: string): Promise<void> =>
      this.req("DELETE", `/plans/${id}`, undefined, {
        Authorization: `Bearer ${jwt}`,
      }),
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

/**
 * A client for interacting with the Search API. Allows us to fetch
 * and search for courses.
 */
class SearchAPIClient {
  private axios: AxiosInstance;

  constructor(baseURL = "https://api.searchneu.com/graphql") {
    this.axios = Axios.create({ baseURL: baseURL });
  }

  fetchCourse = async (
    subject: string,
    classId: string
  ): Promise<ScheduleCourse | null> => {
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
      const course: ScheduleCourse = courseData.class.latestOccurrence;
      course.numCreditsMax = courseData.class.latestOccurrence.maxCredits;
      course.numCreditsMin = courseData.class.latestOccurrence.minCredits;
      delete courseData.class.latestOccurrence.maxCredits;
      delete courseData.class.latestOccurrence.minCredits;
      return course;
    } else {
      return null;
    }
  };

  searchCourses = async (
    searchQuery: string,
    minIndex = 0,
    maxIndex = 9999
  ): Promise<ScheduleCourse[]> => {
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
