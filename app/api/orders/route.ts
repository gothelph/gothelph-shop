import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT o.id, o.name, o.phone, o.email, o.address, o.comment, o.total, o.status, o.created_at
        FROM orders o
        ORDER BY o.created_at DESC
      `);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json({ error: "Ошибка получения заказов" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE orders SET status = $1 WHERE id::text = $2`,
        [status, id]
      );
      return NextResponse.json({ ok: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    return NextResponse.json({ error: "Ошибка обновления заказа" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, address, comment, items, total } = body;

    if (!name || !phone || !address || !items?.length) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        `INSERT INTO orders (name, phone, email, address, comment, total, status)
         VALUES ($1, $
         $2, $3, $4, $5, $6, 'pending')
         RETURNING id`,
        [name, phone, email || null, address, comment || null, total]
      );

      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.productId, item.name, item.price, item.quantity]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({ orderId });
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
      { status: 500 }
    );
  }
}
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json({ error: "Ошибка получения заказов" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, address, comment, items, total } = body;

    if (!name || !phone || !address || !items?.length) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        `INSERT INTO orders (name, phone, email, address, comment, total, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         RETURNING id`,
        [name, phone, email || null, address, comment || null, total]
      );

      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id,
           name, price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.productId, item.name, item.price, item.quantity]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({ orderId });
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
      { status: 500 }
    );
  }
}