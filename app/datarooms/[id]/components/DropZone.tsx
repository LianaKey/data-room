import type { ReactNode } from "react";

interface DropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick?: () => void;
  children: ReactNode;
}

export function DropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  children,
}: DropZoneProps) {
  return (
    <button
      type="button"
      className={`border-2 border-dashed rounded-xl p-8 transition-all w-full ${
        isDragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-zinc-300 dark:border-zinc-700"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
