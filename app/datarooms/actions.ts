"use server";
import { createServerSupabaseClient } from "../../lib/supabaseServer";

export async function createRoom(roomName: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Check if a room with the same name already exists for this user
  const { data: existingRoom } = await supabase
    .from("datarooms")
    .select("id")
    .eq("user_id", user.id)
    .eq("name", roomName)
    .single();

  if (existingRoom) {
    throw new Error("A room with this name already exists");
  }

  const { data, error } = await supabase
    .from("datarooms")
    .insert([{ name: roomName, user_id: user.id }])
    .select();

  if (error) throw error;
  return data;
}

export async function getRooms() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("datarooms")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteRoom(roomId: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Verify the room belongs to the user before deleting
  const { data: room } = await supabase
    .from("datarooms")
    .select("user_id")
    .eq("id", roomId)
    .single();

  if (!room || room.user_id !== user.id) {
    throw new Error("Room not found or you don't have permission to delete it");
  }

  const { error } = await supabase
    .from("datarooms")
    .delete()
    .eq("id", roomId)
    .eq("user_id", user.id);

  if (error) throw error;
}
