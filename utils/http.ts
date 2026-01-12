import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888/",
});

http.interceptors.request.use((request) => {
  // Only access localStorage in browser environment (client-side)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (token) {
      request.headers.Authorization = `${tokenType} ${token}`;
    }

    // Debug logging only in development
    if (process.env.NODE_ENV === "development") {
      console.log("HTTP Request:", {
        url: request.url,
        method: request.method,
        hasToken: !!token,
      });
    }
  }

  return request;
});

http.interceptors.response.use(
  (response) => {
    console.log("HTTP Response Success:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error) => {
    // Always log errors, but with less detail in production
    if (process.env.NODE_ENV === "development") {
      console.error("HTTP Response Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    const response = error?.response;
    const data = response?.data;

    if (!response) {
      // Network error or no response
      return Promise.reject({
        message: error.message || "Network error",
        status: 0,
        originalError: error,
      });
    }

    // Axios response object - extract error message
    const errorMessage =
      (data && data?.message) ||
      response.statusText ||
      data?.status?.message ||
      "Request failed";

    return Promise.reject({
      message: errorMessage,
      status: response.status,
      data: data,
      originalError: error,
    });
  }
);
