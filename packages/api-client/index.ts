import Axios, { AxiosInstance, Method } from "axios";
import {
  CreatePlanDto,
  SignUpStudentDto,
  GetPlanResponse,
  GetStudentResponse,
  INEUAndReq,
  INEUOrReq,
  LoginStudentDto,
  UpdatePlanDto,
  UpdatePlanResponse,
  UpdateStudentDto,
  UpdateStudentResponse,
  OnboardStudentDto,
  ScheduleCourse2,
  Major2,
  GetSupportedMajorsResponse,
  ConfirmEmailDto,
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

  email = {
    confirm: (body: ConfirmEmailDto): Promise<void> =>
      this.req("POST", "/email-confirmation/confirm", undefined, body),
    resendConfirmationLink: (): Promise<void> =>
      this.req("POST", "/email-confirmation/resend-confirmation-link"),
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

  majors = {
    get: (catalogYear: number, majorName: string): Promise<Major2> =>
      this.req<Major2>("GET", `/majors/${catalogYear}/${majorName}`),
    getSupportedMajors: (): Promise<GetSupportedMajorsResponse> =>
      this.req("GET", `/majors/supportedMajors`, GetSupportedMajorsResponse),
  };
}

interface SearchClass {
  name: string;
  classId: string;
  subject: string;
  prereqs?: INEUAndReq | INEUOrReq;
  coreqs?: INEUAndReq | INEUOrReq;
  maxCredits: number;
  minCredits: number;
}

function occurrenceToCourse(occurrence: SearchClass): ScheduleCourse2<null> {
  return {
    name: occurrence.name,
    subject: occurrence.subject,
    classId: occurrence.classId,
    numCreditsMax: occurrence.maxCredits,
    numCreditsMin: occurrence.minCredits,
    prereqs: occurrence.prereqs,
    coreqs: occurrence.coreqs,
    id: null,
  };
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
  ): Promise<ScheduleCourse2<null>> => {
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
    if (courseData && courseData.class && courseData.class.latestOccurrence) {
      return occurrenceToCourse(courseData?.class?.latestOccurrence);
    } else {
      throw Error("Course not found!");
    }
  };

  fetchCourses = async (
    courses: { subject: string; classId: string }[]
  ): Promise<ScheduleCourse2<null>[]> => {
    const input = courses
      .map((course) => {
        return `{subject: "${course.subject}", classId: "${course.classId}"}`;
      })
      .join(",");

    const res = await this.axios({
      method: "post",
      data: {
        query: `{
        bulkClasses(input: [${input}]) {
          latestOccurrence {
            name
            subject
            classId
            minCredits
            maxCredits
            prereqs
            coreqs
            termId
          }
        }
      }`,
      },
    });

    const coursesData = await res.data.data;

    if (coursesData.bulkClasses) {
      return coursesData.bulkClasses.map((course: any) => {
        return occurrenceToCourse(course?.latestOccurrence);
      });
    } else {
      throw Error("Courses could not be fetched");
    }
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
    const nodes = coursesData?.data?.search?.nodes ?? [];

    const courses = nodes.map((result: SearchClass) => {
      return {
        name: result.name,
        classId: result.classId,
        subject: result.subject,
        prereqs: result.prereqs,
        coreqs: result.coreqs,
        numCreditsMin: result.minCredits,
        numCreditsMax: result.maxCredits,
      };
    });

    return courses;
  };
}

export const API = new APIClient();
export const SearchAPI = new SearchAPIClient();
