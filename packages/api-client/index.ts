import Axios, { AxiosInstance } from "axios";
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

class APIClient {
  private axios: AxiosInstance;
  auth = {
    login: async (
      loginUserDto: LoginStudentDto
    ): Promise<GetStudentResponse> => {
      return (await this.axios.post("/api/auth/login", { ...loginUserDto }))
        .data;
    },
    register: async (
      createStudentDto: CreateStudentDto
    ): Promise<GetStudentResponse> => {
      return (
        await this.axios.post("/api/auth/register", { ...createStudentDto })
      ).data;
    },
  };
  student = {
    update: async (
      updateStudentDto: UpdateStudentDto
    ): Promise<UpdateStudentResponse> => {
      return (
        await this.axios.patch("/api/students/me", { ...updateStudentDto })
      ).data;
    },
    student: async (): Promise<GetStudentResponse> => {
      return (await this.axios.get("/api/students/me")).data;
    },
    studentWithPlan: async (): Promise<GetStudentResponse> => {
      return (
        await this.axios.get("/api/students/me", {
          params: { isWithPlans: true },
        })
      ).data;
    },
    delete: async (): Promise<void> => {
      return (await this.axios.delete("/api/students/me")).data;
    },
  };
  plans = {
    create: async (createPlanDto: CreatePlanDto): Promise<GetPlanResponse> => {
      return (await this.axios.post("/api/plans", { ...createPlanDto })).data;
    },
    get: async (id: number): Promise<GetPlanResponse> => {
      return (await this.axios.get(`/api/plans/${id}`)).data;
    },
    update: async (
      id: number,
      updatePlanDto: UpdatePlanDto
    ): Promise<UpdatePlanResponse> => {
      return (await this.axios.patch(`/api/plans/${id}`, { ...updatePlanDto }))
        .data;
    },
    delete: async (id: number): Promise<void> => {
      return (await this.axios.delete(`/api/plans/${id}`)).data;
    },
  };

  constructor(baseURL = "") {
    this.axios = Axios.create({ baseURL: baseURL });
  }
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

class SearchAPIClient {
  private axios: AxiosInstance;

  fetchCourse = async (
    subject: string,
    classId: string
  ): Promise<ScheduleCourse> => {
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

    const courseData = await res.data;
    if (courseData && courseData.class && courseData.class.latestOccurrence) {
      const course: ScheduleCourse = courseData.class.latestOccurrence;
      course.numCreditsMax = courseData.class.latestOccurrence.maxCredits;
      course.numCreditsMin = courseData.class.latestOccurrence.minCredits;
      delete courseData.class.latestOccurrence.maxCredits;
      delete courseData.class.latestOccurrence.minCredits;
      return course;
    } else {
      // throw error?
    }
  };

  searchCourse = async (
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
    const nodes = coursesData.search.nodes;

    return nodes.forEach(
      (result: SearchClass): ScheduleCourse => ({
        name: result.name,
        classId: result.classId,
        subject: result.subject,
        prereqs: result.prereqs,
        coreqs: result.coreqs,
        numCreditsMin: result.minCredits,
        numCreditsMax: result.maxCredits,
        semester: null,
      })
    );
  };

  constructor(baseURL = "https://api.searchneu.com/graphql") {
    this.axios = Axios.create({ baseURL: baseURL });
  }
}

export const API = new APIClient(process.env.API_URL);
export const SearchAPI = new SearchAPIClient(process.env.SEARCH_URL);
