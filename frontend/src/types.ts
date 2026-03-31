// ── Client → Server messages ──

export interface SendMessageAction {
  action: "sendMessage";
  text: string;
  attachments?: Attachment[];
}

export interface RequestUploadUrlAction {
  action: "requestUploadUrl";
  fileName: string;
  mimeType: string;
  size: number;
}

export interface GetHistoryAction {
  action: "getHistory";
  limit?: number;
}

export type ClientMessage =
  | SendMessageAction
  | RequestUploadUrlAction
  | GetHistoryAction;

// ── Attachment (inline base64 or S3 reference) ──

export interface Attachment {
  fileName: string;
  mimeType: string;
  size: number;
  data?: string; // base64 for small files
  s3Key?: string; // for large files uploaded via presigned URL
}

// ── Server → Client messages ──

export interface ConnectedEvent {
  type: "connected";
  connectionId: string;
  userId: string;
  userName?: string;
}

export interface AckEvent {
  type: "ack";
  messageId: string;
}

export interface TextMessageEvent {
  type: "message";
  text: string;
  sender: "bot" | "user";
  timestamp: string;
}

export interface ImageMessageEvent {
  type: "image";
  url: string;
  fileName: string;
  mimeType: string;
  sender: "bot" | "user";
  timestamp: string;
}

export interface FileMessageEvent {
  type: "file";
  url: string;
  fileName: string;
  mimeType: string;
  sender: "bot" | "user";
  timestamp: string;
}

export interface UploadUrlEvent {
  type: "uploadUrl";
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
}

export interface HistoryEvent {
  type: "history";
  messages: ServerEvent[];
}

export interface ErrorEvent {
  type: "error";
  message: string;
}

export type ServerEvent =
  | ConnectedEvent
  | AckEvent
  | TextMessageEvent
  | ImageMessageEvent
  | FileMessageEvent
  | UploadUrlEvent
  | HistoryEvent
  | ErrorEvent;

// ── UI display message ──

export type MessageKind = "text" | "image" | "file";

export interface ChatMessage {
  id: string;
  kind: MessageKind;
  sender: "user" | "bot";
  text?: string;
  url?: string;
  fileName?: string;
  mimeType?: string;
  timestamp: string;
}

// ── Connection state ──

export type ConnectionState = "connecting" | "connected" | "disconnected";
