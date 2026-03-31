import { useCallback } from "react";
import type { Attachment } from "../types";
import { config } from "../lib/config";

interface UseFileUploadOptions {
  sendMessage: (text: string, attachments?: Attachment[]) => void;
  requestUploadUrl: (
    fileName: string,
    mimeType: string,
    size: number,
  ) => Promise<{ uploadUrl: string; s3Key: string }>;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix: "data:...;base64,"
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useFileUpload({ sendMessage, requestUploadUrl }: UseFileUploadOptions) {
  const uploadAndSend = useCallback(
    async (files: File[], text = "") => {
      const attachments: Attachment[] = [];

      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File "${file.name}" exceeds the 50 MB size limit.`);
        }
        if (file.size <= config.inlineThreshold) {
          // ── Small file: inline base64 ──
          const data = await readFileAsBase64(file);
          attachments.push({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            data,
          });
        } else {
          // ── Large file: presigned PUT → S3 ──
          const { uploadUrl, s3Key } = await requestUploadUrl(
            file.name,
            file.type || "application/octet-stream",
            file.size,
          );

          const uploadResp = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type || "application/octet-stream" },
            body: file,
          });
          if (!uploadResp.ok) {
            throw new Error(`S3 upload failed: ${uploadResp.status} ${uploadResp.statusText}`);
          }

          attachments.push({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            s3Key,
          });
        }
      }

      sendMessage(text, attachments);
    },
    [sendMessage, requestUploadUrl],
  );

  return { uploadAndSend };
}
