import axios, { AxiosError } from "axios";
import { loadStoredAuth, clearStoredAuth } from "../store/authStorage";

export const axiosInstance = axios.create({
  baseURL: "https://my-novamart-backend.onrender.com/api",
});

// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  const auth = loadStoredAuth();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;

    // 🚨 ONLY redirect if NOT login request
    if (status === 401 || status === 403) {
      const url = error.config?.url || "";

      if (!url.includes("/auth/login")) {
        clearStoredAuth();

        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
      }
    }

    return Promise.reject({
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        "Something went wrong",
      status,
    });
  }
);

export const apiClient = axiosInstance;
