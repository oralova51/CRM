// client/src/shared/lib/axiosInstance.ts

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

// 🔵 ДЛЯ ОБЫЧНЫХ JSON ЗАПРОСОВ
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 🟢 НОВЫЙ ЭКЗЕМПЛЯР ДЛЯ ФАЙЛОВ (БЕЗ Content-Type)
export const axiosFileInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

let accessToken = "";

export function setAccessToken(newAccessToken: string): void {
  accessToken = newAccessToken;
}

// 🔵 ИНТЕРСЕПТОР ДЛЯ ОБЫЧНОГО ЭКЗЕМПЛЯРА
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    if (!config.headers) {
      config.headers = {} as any;
    }

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

// 🟢 ИНТЕРСЕПТОР ДЛЯ ФАЙЛОВОГО ЭКЗЕМПЛЯРА (тоже нужен токен!)
axiosFileInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    if (!config.headers) {
      config.headers = {} as any;
    }

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

// 🔵 ОБЩИЙ ИНТЕРСЕПТОР ОТВЕТОВ (для обоих экземпляров)
const responseInterceptor = async (error: AxiosError) => {
  const previousRequest = error.config as
    | (InternalAxiosRequestConfig & { sent?: boolean })
    | undefined;

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
        previousRequest.headers = {} as any;
      }

      previousRequest.headers.Authorization = `Bearer ${newToken}`;
      
      // Повторяем запрос с тем же экземпляром, который вызвал ошибку
      if (previousRequest.url?.includes('photo')) {
        return axiosFileInstance(previousRequest);
      }
      return axiosInstance(previousRequest);
    } catch (refreshError) {
      setAccessToken("");
      console.error("Token refresh failed:", refreshError);
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};

// 🔵 ПОДКЛЮЧАЕМ ИНТЕРСЕПТОР К ОБОИМ ЭКЗЕМПЛЯРАМ
axiosInstance.interceptors.response.use(
  (response) => response,
  responseInterceptor
);

axiosFileInstance.interceptors.response.use(
  (response) => response,
  responseInterceptor
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