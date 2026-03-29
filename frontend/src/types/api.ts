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

export interface AddFolderPayload {
  email: string;
  password: string;
  folder_name: string;
  parent_folder?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  email: string;
  password: string;
  files?: File[];
}

export interface EmailAttachment {
  filename: string;
  content_type: string;
  size: number;
  content: string; // base64 encoded
}

export interface Email {
  folder: string;
  from: string;
  subject: string;
  date: string;
  message_id: string;
  body: string;
  attachments: EmailAttachment[];
  has_attachments: boolean;
}