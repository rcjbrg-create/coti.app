import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Allow public routes and API routes without auth check
  const { pathname } = request.nextUrl;

  // Public routes that don't need protection
  if (
    pathname === "/admin" ||
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Protect all /admin/protected/* routes
  if (pathname.startsWith("/admin/protected")) {
    // Check for auth cookie
    const authCookie = request.cookies.get("sb-facdbydtkqabmxkdcugp-auth-token");
    if (!authCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
