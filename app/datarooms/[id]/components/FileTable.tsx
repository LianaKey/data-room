import type { FileObject } from "@supabase/storage-js";
import { useEffect, useRef, useState } from "react";

interface FileTableProps {
  files: FileObject[];
  selectedFiles: Set<string>;
  sortBy: "name" | "type" | "size";
  sortOrder: "asc" | "desc";
  onSelectAll: () => void;
  onSelectFile: (fileName: string) => void;
  onSort: (column: "name" | "type" | "size") => void;
  onNavigateToFolder: (folderName: string) => void;
  onDownload: (fileName: string) => void;
  onDelete: (fileName: string) => void;
  onDeleteFolder: (folderName: string) => void;
  onRename: (oldName: string, newName: string, isFolder: boolean) => void;
  isFolder: (item: FileItem) => boolean;
  formatFileSize: (bytes?: number) => string;
}

export function FileTable({
  files,
  selectedFiles,
  sortBy,
  sortOrder,
  onSelectAll,
  onSelectFile,
  onSort,
  onNavigateToFolder,
  onDownload,
  onDelete,
  onDeleteFolder,
  onRename,
  isFolder,
  formatFileSize,
}: FileTableProps) {
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingFile && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingFile]);

  const handleStartRename = (fileName: string) => {
    setEditingFile(fileName);
    setNewName(fileName);
  };

  const handleCancelRename = () => {
    setEditingFile(null);
    setNewName("");
  };

  const handleSaveRename = (oldName: string, fileIsFolder: boolean) => {
    if (newName.trim() && newName !== oldName) {
      onRename(oldName, newName, fileIsFolder);
    }
    setEditingFile(null);
    setNewName("");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="text-left py-3 px-4">
              <input
                type="checkbox"
                checked={
                  selectedFiles.size > 0 &&
                  selectedFiles.size ===
                    files.filter((f) => f.name !== ".keep").length
                }
                onChange={onSelectAll}
                className="cursor-pointer"
              />
            </th>
            <th
              className="text-left py-3 px-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-2">
                Name
                {sortBy === "name" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th
              className="text-left py-3 px-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              onClick={() => onSort("type")}
            >
              <div className="flex items-center gap-2">
                Type
                {sortBy === "type" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th
              className="text-left py-3 px-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              onClick={() => onSort("size")}
            >
              <div className="flex items-center gap-2">
                Size
                {sortBy === "size" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const fileIsFolder = isFolder(file);
            const isEditing = editingFile === file.name;

            console.log(file);
            return (
              <tr
                key={file.id}
                className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition focus-within:bg-zinc-100 dark:focus-within:bg-zinc-800"
                tabIndex={0}
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.name)}
                    onChange={() => onSelectFile(file.name)}
                    className="cursor-pointer"
                  />
                </td>
                <td
                  className={`py-3 px-4 font-medium ${
                    fileIsFolder && !isEditing
                      ? "text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                  onClick={() =>
                    !isEditing && fileIsFolder && onNavigateToFolder(file.name)
                  }
                  onKeyDown={(e) => {
                    if (
                      !isEditing &&
                      fileIsFolder &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      onNavigateToFolder(file.name);
                    }
                  }}
                  role={fileIsFolder && !isEditing ? "button" : undefined}
                  tabIndex={fileIsFolder && !isEditing ? 0 : undefined}
                >
                  <span className="flex items-center gap-2">
                    {fileIsFolder ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="Folder"
                      >
                        <title>Folder</title>
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="PDF File"
                      >
                        <title>PDF File</title>
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={() => handleSaveRename(file.name, fileIsFolder)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveRename(file.name, fileIsFolder);
                          } else if (e.key === "Escape") {
                            handleCancelRename();
                          }
                        }}
                        className="px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        role="button"
                        tabIndex={0}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(file.name);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.detail === 0) {
                            handleStartRename(file.name);
                          }
                        }}
                        className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px] inline-block"
                      >
                        {file.name}
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  {fileIsFolder ? "Folder" : "PDF"}
                </td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  {formatFileSize(file.metadata?.size)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartRename(file.name)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownload(file.name)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        fileIsFolder
                          ? onDeleteFolder(file.name)
                          : onDelete(file.name)
                      }
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
