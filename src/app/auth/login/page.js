"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await axios.post("/api/auth/login", { email, password });
      router.push("/home");
    } catch (err) {
      alert("Ошибка входа");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">
          Login
        </h1>

        <input
          className="w-full mb-3 p-3 rounded-xl bg-black border border-zinc-700"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 rounded-xl bg-black border border-zinc-700"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black p-3 rounded-xl font-bold hover:bg-yellow-300"
        >
          Login
        </button>

        <p className="text-sm text-zinc-500 mt-4">
          No account?{" "}
          <a href="/auth/register" className="text-yellow-400">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}