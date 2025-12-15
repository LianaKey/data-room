"use server";

import { createAdminSupabaseClient } from "@/lib/supabaseServer";

export async function checkUserExists(
  email: string,
): Promise<boolean | string> {
  try {
    const supabase = createAdminSupabaseClient();

    // Use admin API to check if user exists
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return false;
    }

    // Check if any user has this email
    const userExists = data.users.some(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );

    return userExists ? "Something went wrong. Please try again later." : false;
  } catch (error) {
    return false;
  }
}
