import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types";
import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  onImageClick: (url: string, fileName: string) => void;
}

export function MessageList({ messages, onImageClick }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          Send a message to start the conversation
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} onImageClick={onImageClick} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
