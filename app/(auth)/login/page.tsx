"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setSuccess(true);
        // Use window.location for a full page reload to ensure middleware picks up the session
        setTimeout(() => {
          window.location.href = "/datarooms";
        }, 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-zinc-200 dark:border-zinc-700">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-2 text-center">
          Log In to DataRoom
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              Login successful! Redirecting to your data rooms...
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={loading || success}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={loading || success}
          />
          <button
            type="submit"
            className="w-full rounded-full bg-blue-700 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || success}
          >
            {loading ? "Logging in..." : success ? "Success!" : "Log In"}
          </button>
        </form>
        <p className="text-center text-zinc-600 dark:text-zinc-400 text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-700 hover:underline dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
