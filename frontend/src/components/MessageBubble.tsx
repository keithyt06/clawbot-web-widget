import type { ChatMessage } from "../types";

interface Props {
  message: ChatMessage;
  onImageClick?: (url: string, fileName: string) => void;
}

export function MessageBubble({ message, onImageClick }: Props) {
  const isUser = message.sender === "user";

  const bubbleBase = "max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed break-words";
  const bubbleStyle = isUser
    ? `${bubbleBase} bg-blue-500 text-white rounded-br-md`
    : `${bubbleBase} bg-gray-100 text-gray-800 rounded-bl-md`;

  const alignment = isUser ? "justify-end" : "justify-start";

  return (
    <div className={`flex ${alignment} mb-2`}>
      <div className={bubbleStyle}>
        {/* Text */}
        {message.kind === "text" && (
          <p className="whitespace-pre-wrap m-0">{message.text}</p>
        )}

        {/* Image */}
        {message.kind === "image" && message.url && (
          <div>
            {message.text && (
              <p className="whitespace-pre-wrap m-0 mb-2">{message.text}</p>
            )}
            <img
              src={message.url}
              alt={message.fileName ?? "image"}
              className="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick?.(message.url!, message.fileName ?? "image")}
            />
          </div>
        )}

        {/* File */}
        {message.kind === "file" && message.url && (
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {getFileIcon(message.mimeType)}
            </span>
            <div className="min-w-0">
              <a
                href={message.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block truncate font-medium ${isUser ? "text-white underline" : "text-blue-600 hover:underline"}`}
              >
                {message.fileName ?? "file"}
              </a>
              <span className="text-xs opacity-60">
                {message.mimeType ?? "unknown type"}
              </span>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] mt-1 m-0 ${isUser ? "text-white/60" : "text-gray-400"}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function getFileIcon(mimeType?: string): string {
  if (!mimeType) return "\uD83D\uDCC4"; // page
  if (mimeType.startsWith("video/")) return "\uD83C\uDFA5";
  if (mimeType.startsWith("audio/")) return "\uD83C\uDFB5";
  if (mimeType.includes("pdf")) return "\uD83D\uDCC4";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "\uD83D\uDDDC";
  return "\uD83D\uDCC1";
}
