import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/src/lib/jwt";
import Link from "next/link";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token && verifyToken(token)) {
    redirect("/home");
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-6xl font-black text-yellow-400">Barker</h1>
      <p className="text-zinc-400 text-lg">Your corner of the internet.</p>
      <div className="flex gap-4 mt-4">
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/auth/register"
          className="px-6 py-3 border border-zinc-600 text-white font-bold rounded-full hover:border-yellow-400 hover:text-yellow-400 transition-colors"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
