import { useCallback } from "react";
import type { Attachment } from "../types";
import { config } from "../lib/config";

interface UseFileUploadOptions {
  sendMessage: (text: string, attachments?: Attachment[], localUrls?: Map<string, string>) => void;
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
      // Map fileName → local blob URL for immediate preview
      const localUrls = new Map<string, string>();

      const MAX_FILE_SIZE = 50 * 1024 * 1024;
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File "${file.name}" exceeds the 50 MB size limit.`);
        }

        // Create local preview URL for all files
        localUrls.set(file.name, URL.createObjectURL(file));

        if (file.size <= config.inlineThreshold) {
          const data = await readFileAsBase64(file);
          attachments.push({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            data,
          });
        } else {
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

      sendMessage(text, attachments, localUrls);
    },
    [sendMessage, requestUploadUrl],
  );

  return { uploadAndSend };
}
