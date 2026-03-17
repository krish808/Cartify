import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

//================ REQUEST INTERCEPTOR =================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//================ RESPONSE INTERCEPTOR =================

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/logout")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        failedQueue.forEach((prom) => prom.resolve(newToken));
        failedQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        failedQueue.forEach((prom) => prom.reject(err));
        failedQueue = [];

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
