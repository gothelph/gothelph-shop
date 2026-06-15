import pool from "@/lib/db";
import { errorResponse, okResponse } from "@/lib/utils/api-response";
import { authenticateRequest } from "@/lib/utils/auth-guard";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {

  const auth = authenticateRequest(req, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }
  const { id } = await params;
  const userId = Number(id);
  console.debug(params, 'TEST');

  if (!userId || Number.isNaN(userId)) {
    return errorResponse({
      status: 400,
      code: "INVALID_USER_ID",
      message: "Invalid user id",
    });
  }

  try {
    await pool.query("BEGIN");

    // 1. удалить роли пользователя
    await pool.query(
      `DELETE FROM gothelph.user_roles WHERE user_id = $1`,
      [userId],
    );

    // 2. удалить активные сессии пользователя
    await pool.query(
      `DELETE FROM gothelph.user_sessions WHERE user_id = $1`,
      [userId],
    );

    // 3. удалить самого пользователя
    const result = await pool.query(
      `DELETE FROM gothelph.users WHERE id = $1 RETURNING id`,
      [userId],
    );

    if (result.rowCount === 0) {
      await pool.query("ROLLBACK");

      return errorResponse({
        status: 404,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    await pool.query("COMMIT");

    return okResponse({
      data: {
        id: userId,
        deleted: true,
      },
    });
  } catch (error) {
    await pool.query("ROLLBACK");

    console.error("Delete user error:", error);

    return errorResponse({
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Failed to delete user",
    });
  }
}
