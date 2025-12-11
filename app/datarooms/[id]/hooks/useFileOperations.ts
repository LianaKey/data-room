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

      // Recursively get all files in folder and subfolders
      async function getAllFilesRecursively(path: string): Promise<string[]> {
        const allFiles: string[] = [];

        const { data: items, error: listError } = await supabase.storage
          .from("userimages-prod")
          .list(path, {
            limit: 1000,
            sortBy: { column: "name", order: "asc" },
          });

        if (listError) throw listError;

        if (items && items.length > 0) {
          for (const item of items) {
            const itemPath = `${path}/${item.name}`;

            if (!item.metadata?.mimetype || item.id === item.name) {
              const subFiles = await getAllFilesRecursively(itemPath);
              allFiles.push(...subFiles);
            } else {
              allFiles.push(itemPath);
            }
          }
        }

        return allFiles;
      }

      // Get all files recursively
      const filesToDelete = await getAllFilesRecursively(folderPath);

      if (filesToDelete.length > 0) {
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

  async function handleRename(
    oldFileName: string,
    newFileName: string,
    isFolder: boolean,
  ) {
    if (!newFileName.trim() || oldFileName === newFileName) return;

    try {
      if (!userId) throw new Error("Not authenticated");
      const basePath = currentPath
        ? `${userId}/${roomId}/${currentPath}`
        : `${userId}/${roomId}`;

      if (isFolder) {
        // Rename folder by moving all files
        const oldFolderPath = `${basePath}/${oldFileName}`;
        const newFolderPath = `${basePath}/${newFileName}`;

        // List all files in the folder
        const { data: folderFiles, error: listError } = await supabase.storage
          .from("userimages-prod")
          .list(oldFolderPath, {
            limit: 1000,
            sortBy: { column: "name", order: "asc" },
          });

        if (listError) throw listError;

        if (folderFiles && folderFiles.length > 0) {
          // Move each file to new folder
          for (const file of folderFiles) {
            const oldPath = `${oldFolderPath}/${file.name}`;
            const newPath = `${newFolderPath}/${file.name}`;

            const { error: moveError } = await supabase.storage
              .from("userimages-prod")
              .move(oldPath, newPath);

            if (moveError) throw moveError;
          }
        }
      } else {
        // Rename file
        const oldFilePath = `${basePath}/${oldFileName}`;
        const newFilePath = `${basePath}/${newFileName}`;

        const { error: moveError } = await supabase.storage
          .from("userimages-prod")
          .move(oldFilePath, newFilePath);

        if (moveError) throw moveError;
      }

      await loadFiles();
    } catch (err: unknown) {
      console.error("Failed to rename:", err);
      throw err;
    }
  }

  return {
    handleDelete,
    handleDeleteFolder,
    handleDownload,
    handleCreateFolder,
    handleRename,
  };
}
