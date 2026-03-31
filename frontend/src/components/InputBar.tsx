import { useRef, useState, useEffect, type KeyboardEvent, type DragEvent, type ClipboardEvent } from "react";

interface Props {
  onSend: (text: string, files: File[]) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  // Generate previews for pending files
  useEffect(() => {
    const urls: string[] = [];
    for (const f of pendingFiles) {
      if (f.type.startsWith("image/")) {
        urls.push(URL.createObjectURL(f));
      } else {
        urls.push("");
      }
    }
    setPreviews(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [pendingFiles]);

  const validateAndAdd = (files: File[]) => {
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length) {
      alert(`File(s) exceed 50 MB limit: ${oversized.map((f) => f.name).join(", ")}`);
      return;
    }
    setPendingFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && pendingFiles.length === 0) return;
    onSend(trimmed, pendingFiles);
    setText("");
    setPendingFiles([]);
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
    if (files.length) validateAndAdd(files);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) validateAndAdd(files);
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
      validateAndAdd(files);
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const hasPending = pendingFiles.length > 0;
  const canSend = text.trim().length > 0 || hasPending;

  return (
    <div
      className="border-t border-gray-200 bg-white"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Pending file previews */}
      {hasPending && (
        <div className="flex gap-2 px-3 pt-3 pb-1 overflow-x-auto">
          {pendingFiles.map((f, i) => {
            const isImage = f.type.startsWith("image/");
            return (
              <div key={`${f.name}-${i}`} className="relative flex-shrink-0 group">
                {isImage && previews[i] ? (
                  <img
                    src={previews[i]}
                    alt={f.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                    <span className="text-lg">{getFileEmoji(f.type)}</span>
                    <span className="text-[9px] text-gray-500 truncate max-w-[56px] mt-0.5 px-1">{f.name}</span>
                  </div>
                )}
                {/* Remove button */}
                <button
                  onClick={() => removeFile(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 p-3">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          title="Attach file"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.csv"
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onInput={handleInput}
          rows={1}
          placeholder={hasPending ? "Add a message..." : "Type a message..."}
          disabled={disabled}
          className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-blue-400 disabled:bg-gray-50 overflow-y-auto"
          style={{ maxHeight: 120 }}
        />

        <button
          onClick={handleSend}
          disabled={disabled || !canSend}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white flex items-center justify-center transition-colors"
          title="Send"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function getFileEmoji(mimeType: string): string {
  if (mimeType.startsWith("video/")) return "\uD83C\uDFA5";
  if (mimeType.startsWith("audio/")) return "\uD83C\uDFB5";
  if (mimeType.includes("pdf")) return "\uD83D\uDCC4";
  if (mimeType.includes("zip") || mimeType.includes("rar")) return "\uD83D\uDDDC\uFE0F";
  if (mimeType.includes("sheet") || mimeType.includes("excel") || mimeType.includes("csv")) return "\uD83D\uDCCA";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "\uD83D\uDCCA";
  if (mimeType.includes("word") || mimeType.includes("document")) return "\uD83D\uDCC3";
  return "\uD83D\uDCC1";
}
