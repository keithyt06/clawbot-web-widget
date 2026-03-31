import { useRef, useState, type KeyboardEvent, type DragEvent, type ClipboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, onFiles, disabled }: Props) {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

  const validateFileSize = (files: File[]): boolean => {
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length) {
      alert(`File(s) exceed 50 MB limit: ${oversized.map((f) => f.name).join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length && validateFileSize(files)) onFiles(files);
    // Reset so the same file can be selected again
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length && validateFileSize(files)) onFiles(files);
  };

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (const item of items) {
      if (item.kind === "file") {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) {
      e.preventDefault();
      if (validateFileSize(files)) onFiles(files);
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  return (
    <div
      className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Attachment button */}
      <button
        onClick={() => fileRef.current?.click()}
        className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg transition-colors"
        title="Attach file"
      >
        {"\uD83D\uDCCE"}
      </button>
      <input
        ref={fileRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Text input */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onInput={handleInput}
        rows={1}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-blue-400 disabled:bg-gray-50 overflow-y-auto"
        style={{ maxHeight: 120 }}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white flex items-center justify-center transition-colors"
        title="Send"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
