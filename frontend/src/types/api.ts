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

export interface LoginResponse extends ApiResponse {
  username?: string;
  email?: string;
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
  id: string;
  folder: string;
  from: string;
  subject: string;
  date: string;
  message_id: string;
  body: string;
  attachments: EmailAttachment[];
  has_attachments: boolean;
}

export interface Folder {
  id: string;
  label: string;
  emails: Email[];
  children?: Folder[];
  level?: number;
  isExpanded?: boolean;
}

export interface AddNotePayload {
  email: string;
  password: string;
  title: string;
  description: string;
  priority: string;
  author_name: string;
  author_email: string;
  list_id: string;
  column: string;
}

export interface AddListPayload {
  email: string;
  password: string;
  list_name: string;
  creator_email: string;
  description: string;
}

export interface GetListsPayload {
  email: string;
  password: string;
  page?: number;
  page_size?: number;
}

export interface GetNotesPayload {
  email: string;
  password: string;
  list_id: string;
  page?: number;
  page_size?: number;
}

export interface DeleteListPayload {
  email: string;
  password: string;
  list_id: string;
}

export interface UpdateNoteColumnPayload {
  email: string;
  password: string;
  note_id: string;
  new_column: string;
}

export interface ListInfo {
  list_id: string;
  list_name: string;
  description: string;
  created_by: string;
  admins: string[];
  created_at?: string;
  updated_at?: string;
}

export interface NoteInfo {
  note_id: string;
  title: string;
  description: string;
  priority: string;
  author_name: string;
  author_email: string;
  list_id: string;
  column: string;
  created_at?: string;
  updated_at?: string;
}