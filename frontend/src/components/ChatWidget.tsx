import { useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useFileUpload } from "../hooks/useFileUpload";
import { MessageList } from "./MessageList";
import { InputBar } from "./InputBar";
import { FilePreview } from "./FilePreview";
import { ConnectionStatus } from "./ConnectionStatus";

interface Props {
  userId: string;
}

export function ChatWidget({ userId }: Props) {
  const { connectionState, messages, sendMessage, requestUploadUrl } =
    useWebSocket(userId);

  const { uploadAndSend } = useFileUpload({ sendMessage, requestUploadUrl });

  const [minimized, setMinimized] = useState(false);
  const [preview, setPreview] = useState<{ url: string; fileName: string } | null>(null);

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  const handleFiles = (files: File[]) => {
    uploadAndSend(files);
  };

  const handleImageClick = (url: string, fileName: string) => {
    setPreview({ url, fileName });
  };

  // ── Minimized state: just a floating button ──
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 flex items-center justify-center text-2xl transition-all hover:scale-105"
        title="Open chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  // ── Full widget ──
  return (
    <>
      <div className="fixed bottom-5 right-5 w-[400px] h-[600px] max-w-[calc(100vw-40px)] max-h-[calc(100vh-40px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white flex-shrink-0">
          <div>
            <h1 className="text-base font-semibold m-0">ClawBot</h1>
            <ConnectionStatus state={connectionState} />
          </div>
          <div className="flex items-center gap-1">
            {/* Minimize */}
            <button
              onClick={() => setMinimized(true)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Minimize"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <MessageList messages={messages} onImageClick={handleImageClick} />

        {/* Input */}
        <InputBar
          onSend={handleSend}
          onFiles={handleFiles}
          disabled={connectionState !== "connected"}
        />
      </div>

      {/* Image lightbox */}
      {preview && (
        <FilePreview
          url={preview.url}
          fileName={preview.fileName}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
