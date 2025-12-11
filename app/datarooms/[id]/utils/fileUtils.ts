export function formatFileSize(bytes?: number) {
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

export function isFolder(item: {
  metadata?: { mimetype?: string };
  name: string;
}): boolean {
  return !item.metadata?.mimetype && item.name !== ".keep";
}
