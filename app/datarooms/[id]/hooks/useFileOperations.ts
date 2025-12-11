import { supabase } from "@/lib/supabaseClient";

export function useFileOperations(
  roomId: string,
  currentPath: string,
  userId: string | null,
  loadFiles: () => Promise<void>,
) {
  async function handleDelete(fileName: string) {
    try {
      if (!userId) throw new Error("Not authenticated");
      const basePath = currentPath
        ? `${userId}/${roomId}/${currentPath}`
        : `${userId}/${roomId}`;
      const filePath = `${basePath}/${fileName}`;
      const { error } = await supabase.storage
        .from("userimages-prod")
        .remove([filePath]);

      if (error) throw error;
      await loadFiles();
    } catch (err: unknown) {
      console.error("Failed to delete file:", err);
    }
  }

  async function handleDeleteFolder(folderName: string) {
    try {
      if (!userId) throw new Error("Not authenticated");
      const basePath = currentPath
        ? `${userId}/${roomId}/${currentPath}`
        : `${userId}/${roomId}`;
      const folderPath = `${basePath}/${folderName}`;

      const { data: folderFiles, error: listError } = await supabase.storage
        .from("userimages-prod")
        .list(folderPath, {
          limit: 1000,
          sortBy: { column: "name", order: "asc" },
        });

      if (listError) throw listError;

      if (folderFiles && folderFiles.length > 0) {
        const filesToDelete = folderFiles.map(
          (file) => `${folderPath}/${file.name}`,
        );
        const { error: deleteError } = await supabase.storage
          .from("userimages-prod")
          .remove(filesToDelete);

        if (deleteError) throw deleteError;
      }

      await loadFiles();
    } catch (err: unknown) {
      console.error("Failed to delete folder:", err);
      throw err;
    }
  }

  async function handleDownload(
    fileName: string,
    isFolder: boolean,
    downloadFolderAsZip: (folderName: string) => Promise<void>,
  ) {
    try {
      if (!userId) throw new Error("Not authenticated");

      if (isFolder) {
        await downloadFolderAsZip(fileName);
        return;
      }

      const basePath = currentPath
        ? `${userId}/${roomId}/${currentPath}`
        : `${userId}/${roomId}`;
      const filePath = `${basePath}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("userimages-prod")
        .download(filePath);

      if (error) throw error;
      if (!data) throw new Error("No data received");

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error("Failed to download file:", err);
      throw err;
    }
  }

  async function handleCreateFolder(folderName: string) {
    if (!folderName.trim()) return;

    try {
      if (!userId) throw new Error("Not authenticated");
      const basePath = currentPath
        ? `${userId}/${roomId}/${currentPath}`
        : `${userId}/${roomId}`;
      const folderPath = `${basePath}/${folderName}/.keep`;

      const { error } = await supabase.storage
        .from("userimages-prod")
        .upload(folderPath, new Blob([""]), {
          contentType: "text/plain",
        });

      if (error) throw error;

      await loadFiles();
    } catch (err: unknown) {
      throw err;
    }
  }

  return {
    handleDelete,
    handleDeleteFolder,
    handleDownload,
    handleCreateFolder,
  };
}
