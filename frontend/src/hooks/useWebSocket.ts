import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Attachment,
  ChatMessage,
  ClientMessage,
  ConnectionState,
  ServerEvent,
} from "../types";
import { config } from "../lib/config";
import { generateJwt } from "../lib/jwt";

const MAX_BACKOFF = 30_000;

export function useWebSocket(userId: string) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mountedRef = useRef(true);

  // Pending upload-url callbacks: FIFO queue
  const uploadCallbacksRef = useRef<
    Array<{
      resolve: (value: { uploadUrl: string; s3Key: string }) => void;
      reject: (reason: Error) => void;
      timer: ReturnType<typeof setTimeout>;
    }>
  >([]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const send = useCallback((msg: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const connect = useCallback(async () => {
    if (!mountedRef.current) return;
    setConnectionState("connecting");

    try {
      const token = await generateJwt(userId, userId, config.clientSecret);
      const url = `${config.wsUrl}/ws/widget?clientId=${encodeURIComponent(config.channelId)}&token=${encodeURIComponent(token)}`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        retryRef.current = 0;
        setConnectionState("connected");
        // Request recent history
        send({ action: "getHistory", limit: 50 });
      };

      ws.onmessage = (ev) => {
        if (!mountedRef.current) return;
        let data: ServerEvent;
        try {
          data = JSON.parse(ev.data);
        } catch {
          return;
        }
        handleEvent(data);
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        // Reject all pending upload callbacks
        for (const cb of uploadCallbacksRef.current) {
          clearTimeout(cb.timer);
          cb.reject(new Error("WebSocket connection closed"));
        }
        uploadCallbacksRef.current = [];
        setConnectionState("disconnected");
        scheduleReconnect();
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      setConnectionState("disconnected");
      scheduleReconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  function handleEvent(event: ServerEvent) {
    switch (event.type) {
      case "message":
        addMessage({
          id: crypto.randomUUID(),
          kind: "text",
          sender: event.sender,
          text: event.text,
          timestamp: event.timestamp,
        });
        break;

      case "image":
        addMessage({
          id: crypto.randomUUID(),
          kind: "image",
          sender: event.sender,
          url: event.url,
          fileName: event.fileName,
          mimeType: event.mimeType,
          timestamp: event.timestamp,
        });
        break;

      case "file":
        addMessage({
          id: crypto.randomUUID(),
          kind: "file",
          sender: event.sender,
          url: event.url,
          fileName: event.fileName,
          mimeType: event.mimeType,
          timestamp: event.timestamp,
        });
        break;

      case "uploadUrl": {
        // Resolve first pending upload callback (FIFO)
        const pending = uploadCallbacksRef.current.shift();
        if (pending) {
          clearTimeout(pending.timer);
          pending.resolve({ uploadUrl: event.uploadUrl, s3Key: event.s3Key });
        }
        break;
      }

      case "history":
        if (event.messages?.length) {
          const parsed: ChatMessage[] = [];
          for (const m of event.messages) {
            if (m.type === "message") {
              parsed.push({
                id: crypto.randomUUID(),
                kind: "text",
                sender: m.sender,
                text: m.text,
                timestamp: m.timestamp,
              });
            } else if (m.type === "image") {
              parsed.push({
                id: crypto.randomUUID(),
                kind: "image",
                sender: m.sender,
                url: m.url,
                fileName: m.fileName,
                mimeType: m.mimeType,
                timestamp: m.timestamp,
              });
            } else if (m.type === "file") {
              parsed.push({
                id: crypto.randomUUID(),
                kind: "file",
                sender: m.sender,
                url: m.url,
                fileName: m.fileName,
                mimeType: m.mimeType,
                timestamp: m.timestamp,
              });
            }
          }
          setMessages((prev) => {
            const historyKeys = new Set(
              parsed.map((m) => `${m.timestamp}|${m.sender}|${m.text ?? m.url ?? ""}`),
            );
            const uniquePrev = prev.filter(
              (m) => !historyKeys.has(`${m.timestamp}|${m.sender}|${m.text ?? m.url ?? ""}`),
            );
            return [...parsed, ...uniquePrev];
          });
        }
        break;

      case "error":
        console.error("[ClawBot WS] server error:", event.message);
        break;

      // ack, connected – ignored
      default:
        break;
    }
  }

  function scheduleReconnect() {
    const delay = Math.min(1000 * 2 ** retryRef.current, MAX_BACKOFF);
    retryRef.current += 1;
    timerRef.current = setTimeout(() => connect(), delay);
  }

  // ── Public API ──

  const sendMessage = useCallback(
    (text: string, attachments?: Attachment[], localUrls?: Map<string, string>) => {
      const now = new Date().toISOString();

      // Optimistic text message (only if there's actual text)
      if (text) {
        addMessage({
          id: crypto.randomUUID(),
          kind: "text",
          sender: "user",
          text,
          timestamp: now,
        });
      }

      // Optimistic file/image messages for each attachment
      if (attachments?.length) {
        for (const att of attachments) {
          const isImage = att.mimeType.startsWith("image/");
          // Prefer local blob URL, fall back to base64 data URL
          const url = localUrls?.get(att.fileName)
            ?? (att.data ? `data:${att.mimeType};base64,${att.data}` : undefined);
          addMessage({
            id: crypto.randomUUID(),
            kind: isImage ? "image" : "file",
            sender: "user",
            url,
            fileName: att.fileName,
            mimeType: att.mimeType,
            timestamp: now,
          });
        }
      }

      send({ action: "sendMessage", text, attachments });
    },
    [addMessage, send],
  );

  const requestUploadUrl = useCallback(
    (fileName: string, mimeType: string, size: number): Promise<{ uploadUrl: string; s3Key: string }> => {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          const idx = uploadCallbacksRef.current.findIndex((cb) => cb.resolve === resolve);
          if (idx !== -1) uploadCallbacksRef.current.splice(idx, 1);
          reject(new Error(`Upload URL request timed out for "${fileName}"`));
        }, 30_000);
        uploadCallbacksRef.current.push({ resolve, reject, timer });
        send({ action: "requestUploadUrl", fileName, mimeType, size });
      });
    },
    [send],
  );

  const getHistory = useCallback(
    (limit = 50) => send({ action: "getHistory", limit }),
    [send],
  );

  // ── Lifecycle ──

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      // Reject all pending upload callbacks
      for (const cb of uploadCallbacksRef.current) {
        clearTimeout(cb.timer);
        cb.reject(new Error("Component unmounted"));
      }
      uploadCallbacksRef.current = [];
      wsRef.current?.close();
    };
  }, [connect]);

  return {
    connectionState,
    messages,
    sendMessage,
    requestUploadUrl,
    getHistory,
    send,
  };
}
