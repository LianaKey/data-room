import { useState } from "react";

interface FileItem {
  id: string;
  name: string;
  size?: number;
  created_at?: string;
  metadata?: {
    mimetype?: string;
  };
}

export function useFileSelection(files: FileItem[]) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  function toggleFileSelection(fileName: string) {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  }

  function toggleSelectAll() {
    const visibleFiles = files.filter((f) => f.name !== ".keep");
    if (selectedFiles.size === visibleFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(visibleFiles.map((f) => f.name)));
    }
  }

  function clearSelection() {
    setSelectedFiles(new Set());
  }

  return {
    selectedFiles,
    toggleFileSelection,
    toggleSelectAll,
    clearSelection,
  };
}
