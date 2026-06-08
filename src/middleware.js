import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/jwt";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/auth/login") ||
    req.nextUrl.pathname.startsWith("/auth/register");

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/home") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/settings");

  const isValidToken = !!verifyToken(token);

  if (!isValidToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isValidToken && isAuthPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
