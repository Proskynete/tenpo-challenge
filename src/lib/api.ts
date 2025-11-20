import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { getLocale } from "../utils/common";
import { getToken } from "../utils/cookies";

// Environment variables
const TMDB_BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const isDevelopment = import.meta.env.DEV;

// Common axios configuration
const commonConfig = {
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

/**
 * Auth API Instance
 * Used for internal authentication endpoints
 */
export const authApi = axios.create({
  ...commonConfig,
  baseURL: "/v1/auth",
});

// Auth API Request Interceptor
authApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (isDevelopment) {
      console.log(`[Auth API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    if (isDevelopment) {
      console.error("[Auth API] Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Auth API Response Interceptor
authApi.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log(`[Auth API] Response ${response.status}:`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (isDevelopment) {
      console.error(
        "[Auth API] Response Error:",
        error.response?.data || error.message
      );
    }

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error("Unauthorized access - please login again");
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error - please try again later");
          break;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * TMDb API Instance
 * Used for The Movie Database API calls
 */
export const tmdbApi = axios.create({
  ...commonConfig,
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: getLocale(),
  },
});

// TMDb API Request Interceptor
tmdbApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log requests in development
    if (isDevelopment) {
      console.log(`[TMDb API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    if (isDevelopment) {
      console.error("[TMDb API] Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// TMDb API Response Interceptor
tmdbApi.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log(`[TMDb API] Response ${response.status}`);
    }
    return response;
  },
  (error: AxiosError) => {
    if (isDevelopment) {
      console.error(
        "[TMDb API] Response Error:",
        error.response?.data || error.message
      );
    }

    // Handle TMDb specific errors
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          console.error("Invalid API key");
          break;
        case 404:
          console.error("Movie/Resource not found");
          break;
        case 429:
          console.error("Rate limit exceeded - too many requests");
          break;
        case 500:
          console.error("TMDb server error");
          break;
      }
    }

    return Promise.reject(error);
  }
);
