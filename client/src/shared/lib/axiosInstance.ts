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

    if (
      error.response?.status === 403 &&
      previousRequest &&
      !previousRequest.sent
    ) {
      previousRequest.sent = true;

      try {
        const { data } = await axiosInstance.get<{
          data: { accessToken: string };
        }>("/auth/refresh");

        const newToken = data.data.accessToken;
        setAccessToken(newToken);

        if (!previousRequest.headers) {
          previousRequest.headers = {};
        }

        previousRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(previousRequest);
      } catch (refreshError) {
        setAccessToken("");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
