import Axios, { AxiosInstance } from "axios";
import {
  GetClubResponse,
  CreateClubParams,
  CreateClubResponse,
} from "@graduate/common";

class APIClient {
  private axios: AxiosInstance;
  auth = {
    login: async (p: ): Promise<> => {
      return (await this.axios.get("/api/club")).data;
    },
    register: async (): Promise<> => {
      return (await this.axios.get("/api/club")).data;
    },
  };
  student = {
    create: async(): Promise<> => {

    },
    update: async(): Promise<> => {

    },
    student: async (): Promise<> => {
      return (await this.axios.get("/api/club")).data;
    },
  };
  plans = {
    create: async(): Promise<> => {
      return (await this.axios.post()).data;
    },
    update: async(): Promise<> => {

    },
    plan: async (p: ): Promise<> => {
      return (await this.axios.post("/api/plans", p)).data;
    },
  };

  constructor(baseURL: string = "") {
    this.axios = Axios.create({ baseURL: baseURL });
  }
}

class SearchAPIClient {

}

export const API = new APIClient(process.env.API_URL);
export const SearchAPI = new SearchAPIClient();