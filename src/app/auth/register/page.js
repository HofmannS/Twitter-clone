"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      router.push("/auth/login");
    } catch (err) {
      alert("Registration error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">
          Register
        </h1>

        <input
          className="w-full mb-3 p-3 rounded-xl bg-black border border-zinc-700"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

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
          onClick={handleRegister}
          className="w-full bg-yellow-400 text-black p-3 rounded-xl font-bold hover:bg-yellow-300"
        >
          Create account
        </button>

        <p className="text-sm text-zinc-500 mt-4">
          Already have account?{" "}
          <a href="/auth/login" className="text-yellow-400">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}