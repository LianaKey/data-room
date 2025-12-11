"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

interface GetStartedButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function GetStartedButton({
  className = "inline-block rounded-lg bg-white px-10 py-4 text-lg font-semibold text-blue-700 shadow-lg hover:bg-zinc-100 transition transform hover:scale-105",
  children = "Get Started →",
}: GetStartedButtonProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <button type="button" className={className} disabled>
        Loading...
      </button>
    );
  }

  const href = user ? "/datarooms" : "/login";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
