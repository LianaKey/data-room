import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useFileUpload(
  roomId: string,
  currentPath: string,
  userId: string | null,
  loadFiles: () => Promise<void>,
) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File) {
    // Validate PDF extension
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      if (!userId) throw new Error("Not authenticated");
      const fileName = `${Date.now()}_${file.name}`;
      const basePath = currentPath
        ? `${userId}/${roomId}/${currentPath}`
        : `${userId}/${roomId}`;
      const filePath = `${basePath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("userimages-prod")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      await loadFiles();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  }

  return { uploadFile, uploading, error, setError };
}
