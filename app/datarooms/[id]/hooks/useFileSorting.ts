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

function isFolder(item: FileItem): boolean {
  return !item.metadata?.mimetype && item.name !== ".keep";
}

export function useFileSorting(files: FileItem[], itemsPerPage: number) {
  const [sortBy, setSortBy] = useState<"name" | "type" | "size">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  function handleSort(column: "name" | "type" | "size") {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  }

  function getSortedAndPaginatedFiles() {
    const filteredFiles = files.filter((f) => f.name !== ".keep");

    const sortedFiles = [...filteredFiles].sort((a, b) => {
      const aIsFolder = isFolder(a);
      const bIsFolder = isFolder(b);

      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;

      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "type") {
        const aType = aIsFolder ? "Folder" : "PDF";
        const bType = bIsFolder ? "Folder" : "PDF";
        comparison = aType.localeCompare(bType);
      } else if (sortBy === "size") {
        const aSize = a.size || 0;
        const bSize = b.size || 0;
        comparison = aSize - bSize;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFiles = sortedFiles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedFiles.length / itemsPerPage);

    return { paginatedFiles, totalPages, totalItems: sortedFiles.length };
  }

  return {
    sortBy,
    sortOrder,
    currentPage,
    setCurrentPage,
    handleSort,
    getSortedAndPaginatedFiles,
  };
}
