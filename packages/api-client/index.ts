import Axios, { AxiosInstance } from "axios";
import { CreatePlanDto } from "@graduate/common";

class APIClient {
  private axios: AxiosInstance;
  auth = {
    login: async (): Promise<> => {
      return (await this.axios.post("/api/auth")).data;
    },
    register: async (): Promise<> => {
      return (await this.axios.post("/api/auth")).data;
    },
  };
  student = {
    create: async (): Promise<> => {
      return (await this.axios.post("/api/create")).data;
    },
    update: async (): Promise<> => {
      return (await this.axios.patch("/api/update")).data;
    },
    student: async (): Promise<> => {
      return (await this.axios.get("/api/student")).data;
    },
  };
  plans = {
    create: async (): Promise<> => {
      return (await this.axios.post("")).data;
    },
    update: async (): Promise<> => {
      return (await this.axios.patch("")).data;
    },
    plan: async (): Promise<> => {
      return (await this.axios.post("/api/plans")).data;
    },
  };

  constructor(baseURL: string = "") {
    this.axios = Axios.create({ baseURL: baseURL });
  }
}

class SearchAPIClient {}

export const API = new APIClient(process.env.API_URL);
export const SearchAPI = new SearchAPIClient();
