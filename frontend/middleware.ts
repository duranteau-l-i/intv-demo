import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isExpired } from "@/utils/token";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access-token")?.value;

  if (
    (!accessToken || isExpired(accessToken)) &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    request.nextUrl.pathname !== "/"
  ) {
    request.cookies.set("access-token", "");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)(.+)"]
};
