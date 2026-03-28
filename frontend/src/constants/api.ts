/**
 * API Configuration
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5555/api";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    CREATE_ACCOUNT: "/create-account",
    LOGIN: "/login",
    FETCH_EMAILS: "/getemails",
    ADD_EMAIL_SERVER: "/addemailserver",
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  ACCOUNT_CREATION_FAILED: "Failed to create account",
  LOGIN_FAILED: "Login failed",
  NETWORK_ERROR: "Network error occurred",
} as const;
