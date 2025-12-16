import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const error_description = requestUrl.searchParams.get("error_description");
  const next = requestUrl.searchParams.get("next") || "/datarooms";

  // Handle error from Supabase
  if (error_description) {
    console.error("Auth error from Supabase:", error_description);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error_description)}`,
        requestUrl.origin,
      ),
    );
  }

  try {
    const supabase = await createServerSupabaseClient();

    // Handle token-based verification (email confirmation links)
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      });

      if (error) {
        console.error("Token verification error:", error);
        return NextResponse.redirect(
          new URL("/login?error=verification_failed", requestUrl.origin),
        );
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    return NextResponse.redirect(
      new URL("/login?error=verification_failed", requestUrl.origin),
    );
  } catch (err) {
    return NextResponse.redirect(
      new URL("/login?error=verification_failed", requestUrl.origin),
    );
  }
}
