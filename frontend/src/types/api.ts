/**
 * API Service Types
 */

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

export interface CreateAccountPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
