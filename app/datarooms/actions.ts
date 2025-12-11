"use server";
import { supabase } from "../../lib/supabaseClient";

export async function createRoom(roomName: string) {
  const { data, error } = await supabase
    .from("datarooms")
    .insert([{ name: roomName }]);
  if (error) throw error;
  return data;
}

export async function getRooms() {
  const { data, error } = await supabase
    .from("datarooms")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
