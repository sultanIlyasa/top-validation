import axios from "axios";
import { AxiosError } from "axios";

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "COMPANY" | "ANALYST";
  firstName: string;
  lastName: string;
  company?: any;
  analyst?: any;
  admin?: any;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Try to refresh the token
        const response = await api.post<{ access_token: string }>(
          "/auth/refresh",
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token } = response.data;
        localStorage.setItem("access_token", access_token);

        // Retry the original request
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        if (originalRequest) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>("/auth/profile");
    return data;
  },
};

export const dashboardService = {
  analyst: {
    async getDashboardData(): Promise<any> {
      const { data } = await api.get<any>("/dashboard");
      return data;
    },
  },

  company: {
    async getDashboardData(): Promise<any> {
      const { data } = await api.get<any>("/dashboard");
      return data;
    },
  },
};
export default api;
