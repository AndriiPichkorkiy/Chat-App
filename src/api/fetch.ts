import { ILoginResponse } from "../types/apiTypes";
import { IActiveUserArray } from "../types/chatTypes";
import { IFormData } from "../types/formTypes";

const WEB_ADRESS = "http://localhost:4000";

export const api = {
  getActiveUsers: async (): Promise<IActiveUserArray> => {
    const request = WEB_ADRESS + "/chat/activeUsers";
    try {
      const response = await fetch(request);
      // console.log("response", response);
      const data: IActiveUserArray = await response.json();
      console.log("getActiveUsers", data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }
      throw new Error("Unknow error");
    }
  },
  registration: async (
    user: IFormData
  ): Promise<Pick<IFormData, "name" | "email">> => {
    const request = WEB_ADRESS + "/api/auth/registration";
    try {
      const response = await fetch(request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      return response.json();
      // Pick<IFormData, 'name' | 'email'>
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }
      throw new Error("Unknow error");
    }
  },
  login: async (
    user: Pick<IFormData, "password" | "email">
  ): Promise<ILoginResponse> => {
    const request = WEB_ADRESS + "/api/auth/login";
    try {
      const response = await fetch(request, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      return response.json();
      // Pick<IFormData, 'name' | 'email'>
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }
      throw Error;
    }
  },
};
