import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyMiddlewareToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/auth/login") ||
    req.nextUrl.pathname.startsWith("/auth/register");

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/home") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/settings");

  const verifyResult = await verifyMiddlewareToken(token);
  const isValidToken = !!verifyResult;

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
