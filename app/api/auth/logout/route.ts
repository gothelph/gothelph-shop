// app/api/auth/logout/route.ts
import { clearRefreshTokenCookie } from "@/lib/utils/auth-cookies";
import { okResponse } from "@/lib/utils/api-response";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { REFRESH_COOKIE_NAME } from "@/lib/utils/auth-cookies";
import { hashToken } from "@/lib/utils/token-hash";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (refreshToken) {
    const refreshTokenHash = hashToken(refreshToken);
    await pool.query(
      `UPDATE gothelph.user_sessions
       SET revoked_at = NOW()
       WHERE refresh_token_hash = $1
         AND revoked_at IS NULL`,
      [refreshTokenHash],
    );
  }

  const res = okResponse({ ok: true });
  clearRefreshTokenCookie(res);
  return res;
}
