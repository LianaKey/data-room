import JSZip from "jszip";
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

function isFolder(item: FileItem): boolean {
  return !item.metadata?.mimetype && item.name !== ".keep";
}

export function useZipDownload(
  roomId: string,
  currentPath: string,
  userId: string | null,
) {
  async function downloadFolderAsZip(folderName: string) {
    try {
      const zip = new JSZip();
      await addFolderToZip(zip, folderName, folderName);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error("Error downloading folder as zip:", err);
      throw err;
    }
  }

  async function addFolderToZip(
    zip: JSZip,
    folderName: string,
    zipPath: string,
  ) {
    if (!userId) throw new Error("Not authenticated");
    const path = currentPath
      ? `${userId}/${roomId}/${currentPath}/${folderName}`
      : `${userId}/${roomId}/${folderName}`;

    const { data: items, error } = await supabase.storage
      .from("userimages-prod")
      .list(path);

    if (error) throw error;

    for (const item of items || []) {
      if (item.name === ".keep") continue;

      if (isFolder(item)) {
        await addFolderToZip(
          zip,
          `${folderName}/${item.name}`,
          `${zipPath}/${item.name}`,
        );
      } else {
        const filePath = currentPath
          ? `${userId}/${roomId}/${currentPath}/${folderName}/${item.name}`
          : `${userId}/${roomId}/${folderName}/${item.name}`;

        const { data, error: downloadError } = await supabase.storage
          .from("userimages-prod")
          .download(filePath);

        if (downloadError) {
          console.error(`Error downloading ${item.name}:`, downloadError);
          continue;
        }

        if (data) {
          zip.file(`${zipPath}/${item.name}`, data);
        }
      }
    }
  }

  return { downloadFolderAsZip };
}
