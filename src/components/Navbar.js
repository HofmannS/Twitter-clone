"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => setUser(res.data));
  }, []);

  async function logout() {
    await axios.post("/api/auth/logout");
    setUser(null);
    router.push("/auth/login");
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
      <Link href={user ? "/home" : "/"} className="text-yellow-400 font-black text-xl tracking-tight">
        Barker
      </Link>

      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <Link href="/home" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Home
            </Link>
            <Link
              href="/settings"
              className="text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              Settings
            </Link>
            <Link
              href={`/profile/${user._id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={user.avatar ?? "/avatars/default_avatar.png"}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-zinc-300 hidden sm:block">@{user.username}</span>
            </Link>
            <button
              onClick={logout}
              className="text-zinc-500 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-zinc-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-1.5 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
