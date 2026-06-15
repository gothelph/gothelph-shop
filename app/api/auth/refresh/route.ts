import { cookies } from "next/headers";
import pool from "@/lib/db";
import { errorResponse, okResponse } from "@/lib/utils/api-response";
import {
  REFRESH_COOKIE_NAME,
  setRefreshTokenCookie,
} from "@/lib/utils/auth-cookies";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/utils/jwt";
import { hashToken } from "@/lib/utils/token-hash";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return errorResponse({
      status: 401,
      code: "AUTH_TOKEN_MISSING",
      message: "Refresh token is required",
    });
  }

  const client = await pool.connect();
  let payload: { userId: number, login: string };

  try {
    payload = verifyToken(refreshToken) as { userId: number, login: string };
  } catch {
    client.release();
    return errorResponse({
      status: 401,
      code: "AUTH_TOKEN_INVALID",
      message: "Invalid refresh token",
    });
  }

  try {
    const refreshTokenHash = hashToken(refreshToken);
    const sessionResult = await client.query<{ id: string }>(
      `SELECT id
       FROM gothelph.user_sessions
       WHERE user_id = $1
         AND refresh_token_hash = $2
         AND revoked_at IS NULL
         AND expires_at > NOW()
       LIMIT 1`,
      [payload.userId, refreshTokenHash],
    );

    const session = sessionResult.rows[0];
    if (!session) {
      return errorResponse({
        status: 401,
        code: "AUTH_TOKEN_INVALID",
        message: "Session is expired or revoked",
      });
    }

    const rolesResult = await client.query<{ roles: string[] }>(
      `SELECT COALESCE(
         array_agg(r.name) FILTER (WHERE r.name IS NOT NULL),
         '{}'
       ) AS roles
       FROM gothelph.user_roles ur
       LEFT JOIN gothelph.roles r ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [payload.userId],
    );
    const roles = rolesResult.rows[0]?.roles ?? [];

    const newAccessToken = generateAccessToken(payload.userId, payload.login, roles);

    const newRefreshToken = generateRefreshToken(payload.userId);
    const newRefreshTokenHash = hashToken(newRefreshToken);

    await client.query("BEGIN");
    await client.query(
      `UPDATE gothelph.user_sessions
       SET revoked_at = NOW()
       WHERE id = $1`,
      [session.id],
    );
    await client.query(
      `INSERT INTO gothelph.user_sessions (
         user_id,
         refresh_token_hash,
         user_agent,
         ip_address,
         expires_at
       )
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')`,
      [
        payload.userId,
        newRefreshTokenHash,
        req.headers.get("user-agent"),
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      ],
    );
    await client.query("COMMIT");

    const response = okResponse({ accessToken: newAccessToken });
    setRefreshTokenCookie(response, newRefreshToken);

    return response;
  } catch (error) {
    console.error("Refresh session error:", error);
    await client.query("ROLLBACK").catch(() => undefined);
    return errorResponse({
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Could not refresh session",
    });
  } finally {
    client.release();
  }
}
