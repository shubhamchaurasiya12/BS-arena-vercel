// D:\BS-arena-NextJS\middleware.ts
import { withAuth } from "next-auth/middleware";

/**
 * NextAuth-powered middleware
 * Protects authenticated routes using session cookies
 */
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

/**
 * Apply middleware only to protected routes
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/notes/:path*",
  ],
};