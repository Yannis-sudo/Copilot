/**
 * API Service - Handles all API communication
 */

import {
  API_CONFIG,
  ERROR_MESSAGES,
} from "./constants";
import type { ApiResponse, CreateAccountPayload, LoginPayload, AddEmailServerPayload, AddFolderPayload, SendEmailPayload } from "./types";

/**
 * Make an API request with error handling
 */
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error instanceof Error
      ? error
      : new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
}

/**
 * Create a new user account
 */
export async function createAccount(
  payload: CreateAccountPayload
): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.CREATE_ACCOUNT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Authenticate user with email and password
 */
export async function login(payload: LoginPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch emails from the user from the cloud
 * */
export async function fetchEmails(payload: LoginPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.FETCH_EMAILS, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Add email server configuration
 */
export async function addEmailServer(payload: AddEmailServerPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.ADD_EMAIL_SERVER, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Add a new folder
 */
export async function addFolder(payload: AddFolderPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.ADD_FOLDER, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get all folders
 */
export async function getFolders(payload: LoginPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.GET_FOLDERS, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Send an email
 */
export async function sendEmail(payload: SendEmailPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.SEND_EMAIL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}