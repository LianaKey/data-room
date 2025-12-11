import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface FileItem {
  id: string;
  name: string;
  size?: number;
  created_at?: string;
  metadata?: {
    mimetype?: string;
  };
}

export function useFiles(
  roomId: string,
  currentPath: string,
  userId: string | null,
) {
  const [files, setFiles] = useState<FileItem[]>([]);

  const loadFiles = useCallback(async () => {
    if (!userId) return;
    try {
      const path = currentPath
        ? `${userId}/${roomId}/${currentPath}`
        : `${userId}/${roomId}`;
      const { data, error } = await supabase.storage
        .from("userimages-prod")
        .list(path);

      if (error) throw error;
      setFiles(data || []);
    } catch (err: unknown) {
      console.error("Failed to load files:", err);
    }
  }, [currentPath, roomId, userId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return { files, loadFiles };
}
