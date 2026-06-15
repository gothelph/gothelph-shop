import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/utils/api-response";
import { verifyToken } from "@/lib/utils/jwt";

export interface AccessTokenPayload {
  userId: number;
  login: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

const getBearerToken = (authorization: string | null) => {
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const authenticateRequest = (
  request: Request,
  requiredRoles: string[] = [],
):
  | { ok: true; user: AccessTokenPayload }
  | { ok: false; response: NextResponse } => {
  const token = getBearerToken(request.headers.get("authorization"));
  if (!token) {
    return {
      ok: false,
      response: errorResponse({
        status: 401,
        code: "AUTH_TOKEN_MISSING",
        message: "Authorization Bearer token is required",
      }),
    };
  }

  try {
    const payload = verifyToken(token) as AccessTokenPayload;
    const userRoles = payload.roles ?? [];

    if (requiredRoles.length > 0) {
      const hasAccess = requiredRoles.some((role) => userRoles.includes(role));
      if (!hasAccess) {
        return {
          ok: false,
          response: errorResponse({
            status: 403,
            code: "AUTH_FORBIDDEN",
            message: "Insufficient permissions",
          }),
        };
      }
    }

    return { ok: true, user: payload };
  } catch {
    return {
      ok: false,
      response: errorResponse({
        status: 401,
        code: "AUTH_TOKEN_INVALID",
        message: "Invalid access token",
      }),
    };
  }
};
