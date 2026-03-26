import { api } from "./axiosConfig";

export interface UserInfo {
  username: string;
}

export const authApi = {
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>("/me");
    return response.data;
  },
};
