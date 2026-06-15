import pool from "@/lib/db";
import { errorResponse, okResponse } from "@/lib/utils/api-response";
import { authenticateRequest } from "@/lib/utils/auth-guard";

export async function GET(req: Request) {
  try {
    const auth = authenticateRequest(req, ["admin"]);
    if (!auth.ok) {
      return auth.response;
    }
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim();

    const params: any[] = [];

    let whereClause = "";

    // (опционально) поиск по email
    if (search) {
      params.push(`%${search}%`);
      whereClause = `WHERE u.email ILIKE $1`;
    }

    const query = `
      SELECT 
        u.id,
        u.email,
        COALESCE(
          array_agg(r.name) FILTER (WHERE r.name IS NOT NULL),
          '{}'
        ) AS roles
      FROM gothelph.users u
      LEFT JOIN gothelph.user_roles ur ON ur.user_id = u.id
      LEFT JOIN gothelph.roles r ON r.id = ur.role_id
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.id ASC
    `;

    const res = await pool.query(query, params);

    return okResponse({
      data: res.rows,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return errorResponse({
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Failed to fetch users",
    });
  }
}

