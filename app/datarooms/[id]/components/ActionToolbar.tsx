import type { RefObject } from "react";

interface ActionToolbarProps {
  uploading: boolean;
  currentPath: string;
  selectedFilesCount: number;
  showBulkMenu: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onCreateFolderClick: () => void;
  onNavigateUp: () => void;
  onToggleBulkMenu: () => void;
  onBulkDownload: () => void;
  onBulkDelete: () => void;
}

export function ActionToolbar({
  uploading,
  currentPath,
  selectedFilesCount,
  showBulkMenu,
  fileInputRef,
  onUploadClick,
  onCreateFolderClick,
  onNavigateUp,
  onToggleBulkMenu,
  onBulkDownload,
  onBulkDelete,
}: ActionToolbarProps) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <button
        type="button"
        onClick={onUploadClick}
        className="rounded-lg bg-blue-700 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-800 transition"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" />
      <button
        type="button"
        onClick={onCreateFolderClick}
        className="rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-green-700 transition"
      >
        Create Folder
      </button>

      {currentPath && (
        <button
          type="button"
          onClick={onNavigateUp}
          className="rounded-lg bg-zinc-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-zinc-700 transition"
        >
          ↑ Go Up
        </button>
      )}

      {selectedFilesCount > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={onToggleBulkMenu}
            className="rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-purple-700 transition"
          >
            Bulk Actions ({selectedFilesCount})
          </button>
          {showBulkMenu && (
            <div className="absolute top-full mt-2 left-0 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 min-w-[160px] z-10">
              <button
                type="button"
                onClick={onBulkDownload}
                className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-t-lg transition"
              >
                Download Selected
              </button>
              <button
                type="button"
                onClick={onBulkDelete}
                className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-b-lg transition"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
