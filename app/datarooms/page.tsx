"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createRoom, deleteRoom, getRooms } from "./actions";

interface Room {
  id: string;
  name: string;
  created_at: string;
}

export default function Rooms() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const router = useRouter();

  const loadRooms = useCallback(async () => {
    try {
      const data = await getRooms();
      setRooms(data || []);
    } catch (err: any) {
      console.error("Failed to load rooms:", err);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await createRoom(roomName);

    if (error) {
      setError(error);
    } else {
      setSuccess("Room created successfully!");
      setRoomName("");
      await loadRooms();
    }
    setLoading(false);
  }

  async function handleDeleteRoom(roomId: string, roomName: string) {
    if (
      !confirm(
        `Are you sure you want to delete "${roomName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingRoomId(roomId);
    setError(null);
    setSuccess(null);
    try {
      await deleteRoom(roomId);
      setSuccess("Room deleted successfully!");
      await loadRooms();
    } catch (err: any) {
      setError(err.message || "Failed to delete room");
    } finally {
      setDeletingRoomId(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-700">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-white mb-8 text-center">
          Rooms
        </h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 text-center">
          Create, join, and manage your data rooms for secure file sharing and
          collaboration.
        </p>
        <div className="flex flex-col gap-6">
          <form
            onSubmit={handleCreateRoom}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex gap-3 w-full max-w-2xl">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-700 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-800 transition whitespace-nowrap"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Room"}
              </button>
            </div>
            {error && <span className="text-red-500 text-sm">{error}</span>}
            {success && (
              <span className="text-green-600 text-sm">{success}</span>
            )}
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              or join an existing room below
            </span>
          </form>
          <ul className="mt-4 flex flex-col gap-4">
            {rooms.length === 0 ? (
              <li className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                No rooms yet. Create one to get started!
              </li>
            ) : (
              rooms.map((room) => (
                <li key={room.id}>
                  <div className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 hover:shadow-md transition-all group">
                    <button
                      type="button"
                      onClick={() => router.push(`/datarooms/${room.id}`)}
                      className="flex items-center gap-4 flex-1 cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-lg transition-all text-left"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Room icon</title>
                          <path
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-7l-2-2H5a2 2 0 00-2 2z"
                            fill="currentColor"
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg text-zinc-800 dark:text-zinc-100">
                          {room.name}
                        </span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          Click to open room
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/datarooms/${room.id}`)}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
                      >
                        Join →
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoom(room.id, room.name);
                        }}
                        disabled={deletingRoomId === room.id}
                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete room"
                      >
                        {deletingRoomId === room.id ? (
                          "Deleting..."
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Delete</title>
                            <path
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
