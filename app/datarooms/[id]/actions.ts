"use server";
import { supabase } from "../../../lib/supabaseClient";

export async function uploadFile(roomId: string, file: File) {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `${roomId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("userimages-prod")
    .upload(filePath, file);

  if (error) throw error;
  return data;
}

export async function getFiles(roomId: string) {
  const { data, error } = await supabase.storage
    .from("userimages-prod")
    .list(roomId);

  if (error) throw error;
  return data;
}

export async function deleteFile(roomId: string, fileName: string) {
  const filePath = `${roomId}/${fileName}`;
  const { error } = await supabase.storage
    .from("userimages-prod")
    .remove([filePath]);

  if (error) throw error;
}
