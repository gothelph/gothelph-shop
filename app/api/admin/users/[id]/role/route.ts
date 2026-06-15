import pool from "@/lib/db";
import { errorResponse, okResponse } from "@/lib/utils/api-response";
import { authenticateRequest } from "@/lib/utils/auth-guard";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const auth = authenticateRequest(req, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;
  const userId = Number(id);

  if (!userId || Number.isNaN(userId)) {
    return errorResponse({
      status: 400,
      code: "INVALID_USER_ID",
      message: "Invalid user id",
    });
  }

  try {
    const body = await req.json();
    const roleName = body?.role;

    if (!roleName || typeof roleName !== "string") {
      return errorResponse({
        status: 400,
        code: "INVALID_ROLE",
        message: "Role is required",
      });
    }

    // 1. проверить существует ли роль
    const roleRes = await pool.query(
      `SELECT id, name FROM gothelph.roles WHERE name = $1`,
      [roleName],
    );

    const role = roleRes.rows[0];

    if (!role) {
      return errorResponse({
        status: 404,
        code: "ROLE_NOT_FOUND",
        message: "Role not found",
      });
    }

    await pool.query("BEGIN");

    // 2. удалить старые роли пользователя
    await pool.query(
      `DELETE FROM gothelph.user_roles WHERE user_id = $1`,
      [userId],
    );

    // 3. назначить новую роль
    await pool.query(
      `INSERT INTO gothelph.user_roles (user_id, role_id)
       VALUES ($1, $2)`,
      [userId, role.id],
    );

    await pool.query("COMMIT");

    return okResponse({
      data: {
        userId,
        role: role.name,
      },
    });
  } catch (error) {
    await pool.query("ROLLBACK");

    console.error("Update role error:", error);

    return errorResponse({
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Failed to update role",
    });
  }
}
