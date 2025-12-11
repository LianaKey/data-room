"use client";

import JSZip from "jszip";
import Link from "next/link";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface FileItem {
  id: string;
  name: string;
  size?: number;
  created_at?: string;
  metadata?: {
    mimetype?: string;
  };
}

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "type" | "size">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    try {
      const path = currentPath
        ? `${resolvedParams.id}/${currentPath}`
        : resolvedParams.id;
      const { data, error } = await supabase.storage
        .from("userimages-prod")
        .list(path);

      if (error) throw error;
      setFiles(data || []);
    } catch (err: unknown) {
      console.error("Failed to load files:", err);
    }
  }, [currentPath, resolvedParams.id]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    async function fetchRoomName() {
      try {
        const { data, error } = await supabase
          .from("datarooms")
          .select("name")
          .eq("id", resolvedParams.id)
          .single();

        if (error) throw error;
        if (data) setRoomName(data.name);
      } catch (err: unknown) {
        console.error("Failed to fetch room name:", err);
      }
    }
    fetchRoomName();
  }, [resolvedParams.id]);

  async function uploadFile(file: File) {
    // Validate PDF extension
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const basePath = currentPath
        ? `${resolvedParams.id}/${currentPath}`
        : resolvedParams.id;
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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    // Upload first file only
    const file = droppedFiles[0];
    await uploadFile(file);
  }

  async function handleDelete(fileName: string) {
    try {
      const basePath = currentPath
        ? `${resolvedParams.id}/${currentPath}`
        : resolvedParams.id;
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
      const basePath = currentPath
        ? `${resolvedParams.id}/${currentPath}`
        : resolvedParams.id;
      const folderPath = `${basePath}/${folderName}`;

      // List all files in the folder recursively
      const { data: folderFiles, error: listError } = await supabase.storage
        .from("userimages-prod")
        .list(folderPath, {
          limit: 1000,
          sortBy: { column: "name", order: "asc" },
        });

      if (listError) throw listError;

      // Delete all files in the folder
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
      setError(err instanceof Error ? err.message : "Failed to delete folder");
    }
  }

  async function handleDownload(fileName: string) {
    try {
      const file = files.find((f) => f.name === fileName);
      if (file && isFolder(file)) {
        // Download folder as zip
        await downloadFolderAsZip(fileName);
        return;
      }

      // Download regular file
      const basePath = currentPath
        ? `${resolvedParams.id}/${currentPath}`
        : resolvedParams.id;
      const filePath = `${basePath}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("userimages-prod")
        .download(filePath);

      if (error) throw error;
      if (!data) throw new Error("No data received");

      // Create a download link and trigger it
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
      setError(err instanceof Error ? err.message : "Failed to download file");
    }
  }

  async function handleCreateFolder() {
    if (!folderName.trim()) return;

    try {
      const basePath = currentPath
        ? `${resolvedParams.id}/${currentPath}`
        : resolvedParams.id;
      const folderPath = `${basePath}/${folderName}/.keep`;

      const { error } = await supabase.storage
        .from("userimages-prod")
        .upload(folderPath, new Blob([""]), {
          contentType: "text/plain",
        });

      if (error) throw error;

      setFolderName("");
      setShowCreateFolder(false);
      await loadFiles();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create folder");
    }
  }

  function navigateToFolder(folderName: string) {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
    setCurrentPage(1);
  }

  function navigateUp() {
    const parts = currentPath.split("/");
    parts.pop();
    setCurrentPath(parts.join("/"));
    setCurrentPage(1);
  }

  function isFolder(item: FileItem): boolean {
    return !item.metadata?.mimetype && item.name !== ".keep";
  }

  function formatFileSize(bytes?: number) {
    if (!bytes || bytes === 0) return "—";

    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
  }

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

    // Sort files
    const sortedFiles = [...filteredFiles].sort((a, b) => {
      const aIsFolder = isFolder(a);
      const bIsFolder = isFolder(b);

      // Folders first
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

    // Paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFiles = sortedFiles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedFiles.length / itemsPerPage);

    return { paginatedFiles, totalPages, totalItems: sortedFiles.length };
  }

  async function handleBulkDownload() {
    const selectedItems = Array.from(selectedFiles);
    const folders = selectedItems.filter((fileName) => {
      const file = files.find((f) => f.name === fileName);
      return file && isFolder(file);
    });
    const regularFiles = selectedItems.filter((fileName) => {
      const file = files.find((f) => f.name === fileName);
      return file && !isFolder(file);
    });

    // Download regular files individually
    for (const fileName of regularFiles) {
      await handleDownload(fileName);
    }

    // Download folders as zip
    for (const folderName of folders) {
      await downloadFolderAsZip(folderName);
    }

    setShowBulkMenu(false);
  }

  async function downloadFolderAsZip(folderName: string) {
    try {
      const zip = new JSZip();
      await addFolderToZip(zip, folderName, folderName);

      // Generate and download the zip file
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
      setError(
        err instanceof Error ? err.message : "Failed to download folder",
      );
    }
  }

  async function addFolderToZip(
    zip: JSZip,
    folderName: string,
    zipPath: string,
  ) {
    const path = currentPath
      ? `${resolvedParams.id}/${currentPath}/${folderName}`
      : `${resolvedParams.id}/${folderName}`;

    // List all items in this folder
    const { data: items, error } = await supabase.storage
      .from("userimages-prod")
      .list(path);

    if (error) throw error;

    for (const item of items || []) {
      if (item.name === ".keep") continue;

      if (isFolder(item)) {
        // Recursively add subfolders
        await addFolderToZip(
          zip,
          `${folderName}/${item.name}`,
          `${zipPath}/${item.name}`,
        );
      } else {
        // Download and add file to zip
        const filePath = currentPath
          ? `${resolvedParams.id}/${currentPath}/${folderName}/${item.name}`
          : `${resolvedParams.id}/${folderName}/${item.name}`;

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

  async function handleBulkDelete() {
    for (const fileName of selectedFiles) {
      const file = files.find((f) => f.name === fileName);
      if (file && isFolder(file)) {
        await handleDeleteFolder(fileName);
      } else {
        await handleDelete(fileName);
      }
    }
    setSelectedFiles(new Set());
    setShowBulkMenu(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-zinc-900 dark:via-black dark:to-zinc-800 p-8">
      <div className="w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/datarooms"
            className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition cursor-pointer"
          >
            ← Back to Rooms
          </Link>
          <h1 className="text-4xl font-bold text-blue-700 dark:text-white">
            {roomName || "Loading..."}
          </h1>
        </div>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">
          Welcome to the data room. Upload and manage your files here.
        </p>
        <div className="flex flex-col gap-6">
          {currentPath && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <button
                type="button"
                onClick={navigateUp}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                ← Back
              </button>
              <span>/ {currentPath}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
              Files & Folders
            </h2>
            <div className="flex gap-2 items-center">
              {selectedFiles.size > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowBulkMenu(!showBulkMenu)}
                    className="rounded-full bg-zinc-200 dark:bg-zinc-700 p-3 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition cursor-pointer"
                    title="Bulk actions"
                    aria-label="Bulk actions menu"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Menu icon</title>
                      <circle cx="12" cy="5" r="2" fill="currentColor" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                      <circle cx="12" cy="19" r="2" fill="currentColor" />
                    </svg>
                  </button>
                  {showBulkMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg z-10">
                      <div className="py-2">
                        <button
                          type="button"
                          onClick={handleBulkDownload}
                          className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition cursor-pointer flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Download icon</title>
                            <path
                              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Download ({selectedFiles.size})
                        </button>
                        <button
                          type="button"
                          onClick={handleBulkDelete}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Trash icon</title>
                            <path
                              d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Delete ({selectedFiles.size})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowCreateFolder(true)}
                className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-6 py-3 text-lg font-semibold text-zinc-700 dark:text-zinc-300 shadow-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition cursor-pointer"
              >
                New Folder
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block rounded-full bg-blue-700 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-800 transition cursor-pointer"
              >
                {uploading ? "Uploading..." : "Upload PDF"}
              </label>
            </div>
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {showCreateFolder && (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 bg-zinc-50 dark:bg-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
                Create New Folder
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateFolder(false);
                    setFolderName("");
                  }}
                  className="rounded-lg bg-zinc-300 dark:bg-zinc-700 px-6 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-400 dark:hover:bg-zinc-600 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <button
            type="button"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer w-full ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 hover:border-blue-400 dark:hover:border-blue-500"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={
                  isDragging
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-400"
                }
              >
                <title>Upload icon</title>
                <path
                  d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                  {isDragging
                    ? "Drop PDF file here"
                    : "Drag and drop PDF files here"}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  or click the Upload PDF button above
                </p>
              </div>
            </div>
          </button>
          {files.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 bg-zinc-50 dark:bg-zinc-800">
              <p className="text-zinc-600 dark:text-zinc-400 text-center">
                No files uploaded yet. Upload files to share with your team.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <tr>
                      <th className="px-6 py-3 w-12">
                        <input
                          type="checkbox"
                          checked={
                            files.filter((f) => f.name !== ".keep").length >
                              0 &&
                            selectedFiles.size ===
                              files.filter((f) => f.name !== ".keep").length
                          }
                          onChange={toggleSelectAll}
                          className="rounded border-zinc-300 dark:border-zinc-600 cursor-pointer"
                          aria-label="Select all"
                        />
                      </th>
                      <th
                        className="text-left px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          {sortBy === "name" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                        onClick={() => handleSort("type")}
                      >
                        <div className="flex items-center gap-2">
                          Type
                          {sortBy === "type" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                        onClick={() => handleSort("size")}
                      >
                        <div className="flex items-center gap-2">
                          Size
                          {sortBy === "size" && (
                            <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th className="text-right px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900">
                    {getSortedAndPaginatedFiles().paginatedFiles.map((file) => {
                      const itemIsFolder = isFolder(file);

                      return (
                        <tr
                          key={file.name + file.created_at}
                          className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition focus-within:outline focus-within:outline-2 focus-within:outline-blue-600 dark:focus-within:outline-blue-400 focus-within:outline-offset-[-2px]"
                          tabIndex={0}
                          onDoubleClick={() => {
                            if (itemIsFolder) {
                              navigateToFolder(file.name);
                            }
                          }}
                        >
                          <td className="px-6 py-4 w-12">
                            <input
                              type="checkbox"
                              checked={selectedFiles.has(file.name)}
                              onChange={() => toggleFileSelection(file.name)}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded border-zinc-300 dark:border-zinc-600 cursor-pointer"
                              aria-label={`Select ${file.name}`}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                                  itemIsFolder
                                    ? "bg-blue-100 dark:bg-blue-900"
                                    : "bg-green-100 dark:bg-green-900"
                                }`}
                              >
                                {itemIsFolder ? (
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <title>Folder icon</title>
                                    <path
                                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-7l-2-2H5a2 2 0 00-2 2z"
                                      fill="currentColor"
                                      className="text-blue-600 dark:text-blue-400"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <title>File icon</title>
                                    <path
                                      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-green-600 dark:text-green-400"
                                    />
                                    <path
                                      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-green-600 dark:text-green-400"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="font-medium text-zinc-800 dark:text-zinc-100">
                                {file.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                            {itemIsFolder ? "Folder" : "PDF"}
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => handleDownload(file.name)}
                                className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 transition flex items-center justify-center cursor-pointer"
                                title={
                                  itemIsFolder ? "Download as ZIP" : "Download"
                                }
                                aria-label={
                                  itemIsFolder
                                    ? "Download folder as ZIP"
                                    : "Download file"
                                }
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <title>Download icon</title>
                                  <path
                                    d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  itemIsFolder
                                    ? handleDeleteFolder(file.name)
                                    : handleDelete(file.name)
                                }
                                className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 transition flex items-center justify-center cursor-pointer"
                                title={
                                  itemIsFolder ? "Delete folder" : "Delete file"
                                }
                                aria-label={
                                  itemIsFolder ? "Delete folder" : "Delete file"
                                }
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <title>Trash icon</title>
                                  <path
                                    d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {getSortedAndPaginatedFiles().totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 rounded-b-lg">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      getSortedAndPaginatedFiles().totalItems,
                    )}{" "}
                    of {getSortedAndPaginatedFiles().totalItems} items
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: getSortedAndPaginatedFiles().totalPages },
                        (_, i) => i + 1,
                      )
                        .filter((page) => {
                          const total = getSortedAndPaginatedFiles().totalPages;
                          return (
                            page === 1 ||
                            page === total ||
                            Math.abs(page - currentPage) <= 1
                          );
                        })
                        .map((page, idx, arr) => (
                          <div key={page} className="flex items-center gap-1">
                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                              <span className="px-2 text-zinc-500">...</span>
                            )}
                            <button
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded cursor-pointer transition ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(
                            getSortedAndPaginatedFiles().totalPages,
                            p + 1,
                          ),
                        )
                      }
                      disabled={
                        currentPage === getSortedAndPaginatedFiles().totalPages
                      }
                      className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
