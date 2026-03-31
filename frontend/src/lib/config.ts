export const config = {
  /** WebSocket base URL, e.g. wss://api.nanoclaw.com */
  wsUrl: import.meta.env.VITE_NANOCLAW_WS_URL as string ?? "wss://api.nanoclaw.com",

  /** Channel / client ID */
  channelId: import.meta.env.VITE_CHANNEL_ID as string ?? "demo-channel",

  /** HMAC secret for JWT signing */
  clientSecret: import.meta.env.VITE_CLIENT_SECRET as string ?? "change-me-secret",

  /** Max file size for inline base64 (bytes) */
  inlineThreshold: 256 * 1024, // 256 KB
} as const;
