"use client";

import { use, useEffect, useRef, useState } from "react";
import {
  ActionToolbar,
  CreateFolderForm,
  DropZone,
  EmptyState,
  ErrorDisplay,
  FileTable,
  Pagination,
  RoomHeader,
} from "./components";
import { useAuth } from "./hooks/useAuth";
import { useFileOperations } from "./hooks/useFileOperations";
import { useFileSelection } from "./hooks/useFileSelection";
import { useFileSorting } from "./hooks/useFileSorting";
import { useFiles } from "./hooks/useFiles";
import { useFileUpload } from "./hooks/useFileUpload";
import { useRoom } from "./hooks/useRoom";
import { useZipDownload } from "./hooks/useZipDownload";
import { formatFileSize, isFolder } from "./utils/fileUtils";

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const itemsPerPage = 25;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom hooks
  const { userId } = useAuth();
  const { files, loadFiles } = useFiles(resolvedParams.id, currentPath, userId);
  const { roomName } = useRoom(resolvedParams.id);
  const { uploadFile, uploading, error, setError } = useFileUpload(
    resolvedParams.id,
    currentPath,
    userId,
    loadFiles,
  );
  const { downloadFolderAsZip } = useZipDownload(
    resolvedParams.id,
    currentPath,
    userId,
  );
  const {
    handleDelete,
    handleDeleteFolder,
    handleDownload,
    handleCreateFolder,
    handleRename,
  } = useFileOperations(resolvedParams.id, currentPath, userId, loadFiles);
  const {
    selectedFiles,
    toggleFileSelection,
    toggleSelectAll,
    clearSelection,
    removeFromSelection,
  } = useFileSelection();
  const {
    sortBy,
    sortOrder,
    currentPage,
    setCurrentPage,
    handleSort,
    getSortedAndPaginatedFiles,
  } = useFileSorting(files, itemsPerPage);

  // Clear selections when navigating to different folders or page changes
  useEffect(() => {
    clearSelection();
  }, [currentPage, clearSelection]);

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

    const file = droppedFiles[0];
    await uploadFile(file);
  }

  async function onCreateFolder() {
    try {
      await handleCreateFolder(folderName);
      setFolderName("");
      setShowCreateFolder(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create folder");
    }
  }

  async function onDownload(fileName: string) {
    try {
      const file = files.find((f) => f.name === fileName);
      await handleDownload(
        fileName,
        file ? isFolder(file) : false,
        downloadFolderAsZip,
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to download file");
    }
  }

  async function onDeleteFolder(folderName: string) {
    try {
      await handleDeleteFolder(folderName);
      removeFromSelection(folderName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete folder");
    }
  }

  async function onDelete(fileName: string) {
    try {
      await handleDelete(fileName);
      removeFromSelection(fileName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
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

    for (const fileName of regularFiles) {
      await onDownload(fileName);
    }

    for (const folderName of folders) {
      await downloadFolderAsZip(folderName);
    }

    setShowBulkMenu(false);
  }

  async function handleBulkDelete() {
    for (const fileName of selectedFiles) {
      const file = files.find((f) => f.name === fileName);
      if (file && isFolder(file)) {
        await onDeleteFolder(fileName);
      } else {
        await handleDelete(fileName);
      }
    }
    clearSelection();
    setShowBulkMenu(false);
  }

  async function onRename(
    oldName: string,
    newName: string,
    fileIsFolder: boolean,
  ) {
    try {
      await handleRename(oldName, newName, fileIsFolder);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to rename");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-zinc-900 dark:via-black dark:to-zinc-800 p-8">
      <div className="w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-700">
        <RoomHeader roomName={roomName || "Loading..."} />

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

          <ErrorDisplay error={error} />

          {showCreateFolder && (
            <CreateFolderForm
              folderName={folderName}
              onFolderNameChange={setFolderName}
              onCreateFolder={onCreateFolder}
              onCancel={() => {
                setShowCreateFolder(false);
                setFolderName("");
              }}
            />
          )}

          <ActionToolbar
            uploading={uploading}
            currentPath={currentPath}
            selectedFilesCount={selectedFiles.size}
            showBulkMenu={showBulkMenu}
            fileInputRef={fileInputRef}
            onUploadClick={() => fileInputRef.current?.click()}
            onCreateFolderClick={() => setShowCreateFolder(true)}
            onNavigateUp={navigateUp}
            onToggleBulkMenu={() => setShowBulkMenu(!showBulkMenu)}
            onBulkDownload={handleBulkDownload}
            onBulkDelete={handleBulkDelete}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />

          <DropZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
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
          </DropZone>

          {files.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <FileTable
                files={getSortedAndPaginatedFiles().paginatedFiles}
                selectedFiles={selectedFiles}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSelectAll={() =>
                  toggleSelectAll(getSortedAndPaginatedFiles().paginatedFiles)
                }
                onSelectFile={toggleFileSelection}
                onSort={handleSort}
                onNavigateToFolder={navigateToFolder}
                onDownload={onDownload}
                onDelete={onDelete}
                onDeleteFolder={onDeleteFolder}
                onRename={onRename}
                isFolder={isFolder}
                formatFileSize={formatFileSize}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={getSortedAndPaginatedFiles().totalPages}
                totalItems={getSortedAndPaginatedFiles().totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
