interface CreateFolderFormProps {
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onCreateFolder: () => void;
  onCancel: () => void;
}

export function CreateFolderForm({
  folderName,
  onFolderNameChange,
  onCreateFolder,
  onCancel,
}: CreateFolderFormProps) {
  return (
    <div className="mb-6 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
        Create New Folder
      </h3>
      <div className="flex gap-3">
        <input
          type="text"
          value={folderName}
          onChange={(e) => onFolderNameChange(e.target.value)}
          placeholder="Folder name"
          className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="button"
          onClick={onCreateFolder}
          className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition"
        >
          Create
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-zinc-500 px-6 py-2 text-white hover:bg-zinc-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
