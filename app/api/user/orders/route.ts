import { getUserFromRequest } from "@/lib/auth/getUserFromRequest";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = getUserFromRequest(request);

  try {
    const result = await pool.query(
      `SELECT o.id, o.created_at, os.name AS status, p.name AS product_name, pi.image_url
        from orders o
        join order_statuses os on os.id = o.status_id
        join order_items oi on oi.order_id = o.id 
        join products p on p.id = oi.product_id
        join product_images pi on pi.product_id = p.id
        WHERE o.user_id = $1`,
      [user?.userId],
    );

    return NextResponse.json({
      orders: result.rows,
    });
  } catch (error) {
    console.error("Ошибка запроса заказов:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки заказов" },
      { status: 500 },
    );
  }
}
