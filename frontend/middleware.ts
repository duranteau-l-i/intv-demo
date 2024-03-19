import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("access-token")?.value;

  if (
    !currentUser &&
    !request.nextUrl.pathname.startsWith("/login") &&
    request.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)(.+)"]
};
