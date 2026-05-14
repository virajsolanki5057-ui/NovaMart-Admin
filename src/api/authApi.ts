import { apiClient } from "./axiosInterceptor";
import { saveStoredAuth } from "../api/authStorage";

export interface LoginApiRequest {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  login: async (payload: LoginApiRequest) => {
    const { data } = await apiClient.post<LoginApiResponse>(
      "/auth/login",
      payload
    );

    // ✅ IMPORTANT: Save token
    saveStoredAuth({
      token: data.token,
      user: data.user,
    });

    return data;
  },
};