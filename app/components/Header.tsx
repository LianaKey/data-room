"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "./UserMenu";

export default function Header() {
  const { user, loading } = useAuth();

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
          {user && !loading && <UserMenu userEmail={user.email || ""} />}
        </div>
      </div>
    </header>
  );
}
