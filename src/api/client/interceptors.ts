import apiClients from "./client";

export const setupInterceptors = () =>
  // getCurrentUser: () => Promise<{ token: string | null }>
  {
    apiClients.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers["Content-Type"] = "application/json";

        return config;
      },
      (error) => Promise.reject(error),
    );

    apiClients.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        return Promise.reject(error);
      },
    );
    apiClients.client2.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers["Content-Type"] = "application/json";

        return config;
      },
      (error) => Promise.reject(error),
    );

    apiClients.client2.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        return Promise.reject(error);
      },
    );

    apiClients.client3.interceptors.request.use(
      (config) => {
        config.headers["Content-Type"] = "multipart/form-data";

        return config;
      },
      (error) => Promise.reject(error),
    );

    apiClients.client2.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        return Promise.reject(error);
      },
    );
  };
