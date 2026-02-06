import { NextRequest, NextResponse } from "next/server";

/**
 * Global auth middleware
 * Runs at the Edge (NO jwt verification here)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Public routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // 🔒 Protect dashboard pages and APIs
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/dashboard")
  ) {
    // Cookie (SSR navigation)
    const cookieToken = req.cookies.get("token")?.value;

    // Authorization header (API calls)
    const authHeader = req.headers.get("authorization");
    const headerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = cookieToken || headerToken;

    // ❗ Only check presence here
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * Limit middleware scope
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/dashboard/:path*",
  ],
};
