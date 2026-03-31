import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/utils/jwt";

const getBearerToken = (request: NextRequest) => {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export function middleware(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json(
      {
        error: { code: "AUTH_TOKEN_MISSING", message: "Missing bearer token" },
      },
      { status: 401 },
    );
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      {
        error: { code: "AUTH_TOKEN_INVALID", message: "Invalid access token" },
      },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: ["/api/secure/:path*"],
};
