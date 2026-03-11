// client/src/shared/lib/axiosInstance.ts

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let accessToken = "";

export function setAccessToken(newAccessToken: string): void {
  accessToken = newAccessToken;
}

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  if (accessToken) {
    if (!config.headers) {
      config.headers = {};
    }

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const previousRequest = error.config as
      | (AxiosRequestConfig & { sent?: boolean })
      | undefined;

    // Ловим и 401, и 403
    const status = error.response?.status;
    const shouldRefresh = status === 401 || status === 403;
    
    if (shouldRefresh && previousRequest && !previousRequest.sent) {
      previousRequest.sent = true;

      try {
        const response = await axios.get<{
          data: { accessToken: string };
        }>(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
          withCredentials: true,
        });

        const newToken = response.data.data.accessToken;
        setAccessToken(newToken);

        if (!previousRequest.headers) {
          previousRequest.headers = {};
        }

        previousRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(previousRequest);
      } catch (refreshError) {
        setAccessToken("");
        // Не редиректим сразу, дадим возможность обновиться
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Добавляем обработку для предотвращения циклических редиректов
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};