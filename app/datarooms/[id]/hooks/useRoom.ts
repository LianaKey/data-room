import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRoom(roomId: string) {
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    async function fetchRoomName() {
      try {
        const { data, error } = await supabase
          .from("datarooms")
          .select("name")
          .eq("id", roomId)
          .single();

        if (error) throw error;
        if (data) setRoomName(data.name);
      } catch (err: unknown) {
        console.error("Failed to fetch room name:", err);
      }
    }
    fetchRoomName();
  }, [roomId]);

  return { roomName };
}
