interface RoomHeaderProps {
  roomName: string;
}

export function RoomHeader({ roomName }: RoomHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <a
        href="/datarooms"
        className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition cursor-pointer"
      >
        ← Back to Rooms
      </a>
      <h1 className="text-4xl font-bold text-blue-700 dark:text-white">
        {roomName || "Loading..."}
      </h1>
    </div>
  );
}
