"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createRoom, getRooms } from "./actions";

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
  const router = useRouter();

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      const data = await getRooms();
      setRooms(data || []);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    }
  }

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createRoom(roomName);
      setSuccess("Room created successfully!");
      setRoomName("");
      await loadRooms();
    } catch (err) {
      setError(err.message || "Failed to create room");
    } finally {
      setLoading(false);
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
                  <button
                    type="button"
                    onClick={() => router.push(`/datarooms/${room.id}`)}
                    onDoubleClick={() => router.push(`/datarooms/${room.id}`)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 p-5 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4 flex-1">
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
                    </div>
                    <span className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white group-hover:bg-blue-700 transition shadow-sm">
                      Join →
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
