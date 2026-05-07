import axios, { type AxiosError, type AxiosResponse } from "axios";

// Get API base URL from environment variable, default to /api
const apiBase = import.meta.env.VITE_API_BASE || "/geodata/api";

export const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

// Custom error class for API errors
export class ApiError extends Error {
  statusCode?: number;
  response?: AxiosResponse<unknown>;

  constructor(
    message: string,
    statusCode?: number,
    response?: AxiosResponse<unknown>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      const message =
        (error.response.data as { message?: string })?.message ||
        error.message ||
        "Ett fel uppstod";

      throw new ApiError(message, statusCode, error.response);
    } else if (error.request) {
      // Request was made but no response received
      throw new ApiError(
        "Ingen anslutning till servern. Kontrollera din internetanslutning.",
        0,
      );
    } else {
      // Something else happened
      throw new ApiError(error.message || "Ett oväntat fel uppstod");
    }
  },
);
