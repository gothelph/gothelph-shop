import pool from "@/lib/db";
import { authenticateRequest } from "@/lib/utils/auth-guard";
import { NextResponse } from "next/server";

export async function GET(
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
    return NextResponse.json(
      { error: "Invalid user id" },
      { status: 400 },
    );
  }

  try {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `
        SELECT 
          o.id,
          u.email,
          u.username,
          u.phone,
          u.address,

          COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total,
          s.name AS status,
          o.created_at
          
        FROM gothelph.orders o

        LEFT JOIN gothelph.users u ON u.id = o.user_id
        LEFT JOIN gothelph.order_statuses s ON s.id = o.status_id
        LEFT JOIN gothelph.order_items oi ON oi.order_id = o.id

        WHERE o.user_id = $1

        GROUP BY 
          o.id,
          u.email,
          u.username,
          u.phone,
          u.address,
          s.name,
          o.created_at

        ORDER BY o.created_at DESC
        `,
        [userId],
      );

      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);

    return NextResponse.json(
      { error: "Ошибка получения заказов пользователя" },
      { status: 500 },
    );
  }
}
