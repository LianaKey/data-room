"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, loading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDropdown]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.push("/");
  }

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center justify-between w-full gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/file.svg" alt="Logo" width={40} height={40} />
          <span className="text-2xl font-bold text-blue-700 dark:text-white">
            DataRoom
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-8 text-lg text-zinc-700 dark:text-zinc-200">
            <Link href="/features" className="hover:text-blue-600">
              Features
            </Link>
            <Link href="/security" className="hover:text-blue-600">
              Security
            </Link>
            {loading ? (
              <span className="text-zinc-400">Loading...</span>
            ) : !user ? (
              <Link href="/login" className="hover:text-blue-600">
                Get Started
              </Link>
            ) : (
              <Link href="/datarooms" className="hover:text-blue-600">
                My Rooms
              </Link>
            )}
          </nav>
          {user && !loading && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
                aria-label="User menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>User menu</title>
                  <path
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 z-50">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition cursor-pointer"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Sign out</title>
                        <path
                          d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
