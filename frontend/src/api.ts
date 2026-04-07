/**
 * API Service - Handles all API communication
 */

import {
  API_CONFIG,
  ERROR_MESSAGES,
} from "./constants";
import type { ApiResponse, CreateAccountPayload, LoginPayload, LoginResponse, AddEmailServerPayload, AddFolderPayload, SendEmailPayload, AddNotePayload, AddListPayload, GetListsPayload, GetNotesPayload, DeleteListPayload, UpdateNoteColumnPayload, UpdatePermissionsPayload, UpdatePermissionsResponse, GetPermissionsPayload, GetPermissionsResponse } from "./types";

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
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return makeRequest<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
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
 * Send an email with optional file attachments
 */
export async function sendEmail(payload: SendEmailPayload): Promise<ApiResponse> {
  // Create FormData for file upload
  const formData = new FormData();
  
  // Add text fields
  formData.append('to', payload.to);
  formData.append('subject', payload.subject);
  formData.append('body', payload.body);
  formData.append('email', payload.email);
  formData.append('password', payload.password);
  
  // Add files if provided
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append('files', file);
    });
  }
  
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEND_EMAIL}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData, // Don't set Content-Type header, let browser set it with boundary
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${API_CONFIG.ENDPOINTS.SEND_EMAIL}]:`, error);
    throw error instanceof Error
      ? error
      : new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
}

/**
 * Add a new note
 */
export async function addNote(payload: AddNotePayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.ADD_NOTE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Add a new list
 */
export async function addList(payload: AddListPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.ADD_LIST, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get all lists for the user
 */
export async function getLists(payload: GetListsPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.GET_LISTS, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get notes from a specific list
 */
export async function getNotes(payload: GetNotesPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.GET_NOTES, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a list
 */
export async function deleteList(payload: DeleteListPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.DELETE_LIST, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a note's column
 */
export async function updateNoteColumn(payload: UpdateNoteColumnPayload): Promise<ApiResponse> {
  return makeRequest<ApiResponse>(API_CONFIG.ENDPOINTS.UPDATE_NOTE_COLUMN, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Update user permissions for a list
 */
export async function updatePermissions(payload: UpdatePermissionsPayload): Promise<UpdatePermissionsResponse> {
  return makeRequest<UpdatePermissionsResponse>(API_CONFIG.ENDPOINTS.UPDATE_PERMISSIONS, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get all users with permissions for a list
 */
export async function getPermissions(payload: GetPermissionsPayload): Promise<GetPermissionsResponse> {
  return makeRequest<GetPermissionsResponse>(API_CONFIG.ENDPOINTS.GET_PERMISSIONS, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}