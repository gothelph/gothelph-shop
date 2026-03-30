import { authenticateRequest } from "@/lib/utils/auth-guard";
import { errorResponse, okResponse } from "@/lib/utils/api-response";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const auth = authenticateRequest(req, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const result = await pool.query(
      `DELETE FROM gothelph.user_sessions
       WHERE expires_at < NOW()
          OR (revoked_at IS NOT NULL AND revoked_at < NOW() - INTERVAL '30 days')`,
    );

    return okResponse({
      ok: true,
      deletedSessions: result.rowCount ?? 0,
    });
  } catch (error) {
    console.error("Session cleanup error:", error);
    return errorResponse({
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Failed to cleanup sessions",
    });
  }
}
