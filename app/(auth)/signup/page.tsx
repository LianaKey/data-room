"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { checkUserExists } from "./actions";
import { VerificationEmailSent } from "./VerificationEmailSent";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if user exists in database before attempting signup
      const userExists = await checkUserExists(email);

      if (userExists) {
        setError("Something went wrong. Please try again later.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        if (data.session) {
          // User is automatically logged in (email confirmation disabled)
          setSuccess(true);
          setTimeout(() => {
            window.location.href = "/datarooms";
          }, 1500);
        } else {
          // Email confirmation required
          setSuccess(true);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-zinc-200 dark:border-zinc-700">
        {success ? (
          <VerificationEmailSent email={email} />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-2 text-center">
              Sign Up for DataRoom
            </h1>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="submit"
                className="w-full rounded-full bg-blue-700 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            <p className="text-center text-zinc-600 dark:text-zinc-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-700 hover:underline dark:text-blue-400"
              >
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
