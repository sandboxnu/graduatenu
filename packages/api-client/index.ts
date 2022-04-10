import Axios, { AxiosInstance } from "axios";
import {
  CreatePlanDto,
  CreateStudentDto,
  GetPlanResponse,
  GetStudentResponse,
  LoginStudentDto,
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

class SearchAPIClient {}

export const API = new APIClient(process.env.API_URL);
export const SearchAPI = new SearchAPIClient();
