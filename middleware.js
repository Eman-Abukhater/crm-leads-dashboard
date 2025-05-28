import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow requests for public files and auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // If the route is public, allow it
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Not logged in? Redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  //  Role-based route protection
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/manager") && !["admin", "sales-manager"].includes(token.role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/rep") && token.role !== "sales-rep") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
