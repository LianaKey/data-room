import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/datarooms";

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(
      new URL("/login?error=verification_failed", requestUrl.origin),
    );
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL("/login?error=verification_failed", requestUrl.origin),
      );
    }

    if (!data.session) {
      console.error("No session created from code exchange");
      return NextResponse.redirect(
        new URL("/login?error=verification_failed", requestUrl.origin),
      );
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (err) {
    console.error("Exception in auth callback:", err);
    return NextResponse.redirect(
      new URL("/login?error=verification_failed", requestUrl.origin),
    );
  }
}
