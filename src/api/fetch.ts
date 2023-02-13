import { IActiveUserArray } from "../types/chatTypes";

const WEB_ADRESS = "http://localhost:4000";

export const api = {
  getActiveUsers: async (): Promise<IActiveUserArray | string> => {
    const api = WEB_ADRESS + "/chat/activeUsers";
    try {
      const response = await fetch(api);
      // console.log("response", response);
      const data: IActiveUserArray = await response.json();
      console.log("data", data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Unknow error";
    }
  },
};
