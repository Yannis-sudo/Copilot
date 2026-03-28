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

export interface AddEmailServerPayload {
  email: string;
  server_incoming: string;
  server_outgoing: string;
  server_incoming_port: number;
  server_outgoing_port: number;
  password: string;
}