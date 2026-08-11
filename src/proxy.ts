import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.SESSION_SECRET || "hackathon-uni-dev-secret-change-me";
const COOKIE_NAME = "hackuni_session";

const PUBLIC_PATHS = ["/login"];

// Rutas que solo puede ver el rol ADMIN
const ADMIN_ONLY = ["/mentores", "/jueces", "/desafios"];
// Rutas exclusivas de jueces
const JUEZ_ONLY = ["/evaluaciones/nueva"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || pathname.startsWith("/_next") || pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { role: string };

    if (ADMIN_ONLY.some((p) => pathname.startsWith(p)) && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (JUEZ_ONLY.some((p) => pathname.startsWith(p)) && decoded.role !== "JUEZ") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
