import pool from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * CREATE order
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, items } = body;

    if (!userId || !items?.length) {
      return NextResponse.json(
        { error: "userId and items are required" },
        { status: 400 },
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. взять статус "pending"
      const statusRes = await client.query(
        `SELECT id FROM gothelph.order_statuses WHERE name = 'pending' LIMIT 1`,
      );

      const statusId = statusRes.rows[0]?.id;

      // 2. создать заказ (ТОЛЬКО user_id + status_id)
      const orderResult = await client.query(
        `
        INSERT INTO gothelph.orders (user_id, status_id)
        VALUES ($1, $2)
        RETURNING id
        `,
        [userId, statusId],
      );

      const orderId = orderResult.rows[0].id;

      // 3. создать позиции заказа
      for (const item of items) {
        await client.query(
          `
          INSERT INTO gothelph.order_items
            (order_id, product_variant_id, quantity, price_at_purchase)
          VALUES
            ($1, $2, $3, $4)
          `,
          [
            orderId,
            item.productVariantId,
            item.quantity,
            item.price,
          ],
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        orderId,
        success: true,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("ORDER API ERROR:", error);

    return NextResponse.json(
      { error: "Ошибка оформления заказа" },
      { status: 500 },
    );
  }
}
