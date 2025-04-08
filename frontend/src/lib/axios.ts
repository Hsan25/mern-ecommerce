import axios, {
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API,
  withCredentials: true,
});

export interface ConfigAxios extends InternalAxiosRequestConfig {
  headers: AxiosHeaders;
  _retry?: boolean;
}

// Flag untuk menghindari multiple refresh request secara bersamaan
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

apiService.interceptors.request.use(
  async (config: ConfigAxios) => {
    const token = localStorage.getItem("token");
    if (token && !config._retry) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 (Unauthorized) dan bukan karena refresh token gagal
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return apiService(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Ambil token baru dari `/auth/token`
        const { data } = await apiService.get("/auth/token");

        // Update token baru
        apiService.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
        processQueue(null, data.token);
        isRefreshing = false;

        localStorage.setItem("token", data.token);
        // Retry request sebelumnya yang gagal
        originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
        return apiService(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiService;
