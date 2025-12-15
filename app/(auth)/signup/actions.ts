"use server";

import { createAdminSupabaseClient } from "@/lib/supabaseServer";

export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const supabase = createAdminSupabaseClient();

    // Use admin API to check if user exists
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Error checking user existence:", error);
      return false;
    }

    // Check if any user has this email
    const userExists = data.users.some(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );

    return userExists;
  } catch (error) {
    console.error("Error in checkUserExists:", error);
    return false;
  }
}
