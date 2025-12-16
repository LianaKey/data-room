import type { FileObject } from "@supabase/storage-js";
import { useState } from "react";

export function useFileSelection() {
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

  function toggleSelectAll(currentPageFiles: FileObject[]) {
    const visibleFiles = currentPageFiles.filter((f) => f.name !== ".keep");
    const allCurrentPageSelected = visibleFiles.every((f) =>
      selectedFiles.has(f.name),
    );

    if (allCurrentPageSelected && visibleFiles.length > 0) {
      // Deselect all files on current page
      setSelectedFiles((prev) => {
        const newSet = new Set(prev);
        visibleFiles.forEach((f) => newSet.delete(f.name));
        return newSet;
      });
    } else {
      // Select all files on current page
      setSelectedFiles((prev) => {
        const newSet = new Set(prev);
        visibleFiles.forEach((f) => newSet.add(f.name));
        return newSet;
      });
    }
  }

  function clearSelection() {
    setSelectedFiles(new Set());
  }

  function removeFromSelection(fileName: string) {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileName);
      return newSet;
    });
  }

  return {
    selectedFiles,
    toggleFileSelection,
    toggleSelectAll,
    clearSelection,
    removeFromSelection,
  };
}
