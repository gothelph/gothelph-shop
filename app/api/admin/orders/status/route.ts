import pool from "@/lib/db";
import { authenticateRequest } from "@/lib/utils/auth-guard";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const auth = authenticateRequest(req, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 },
      );
    }

    const statusMap: Record<string, number> = {
      shipped: 3,
      delivered: 4,
      cancelled: 5,
    };

    const statusId = statusMap[status];

    if (!statusId) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 },
      );
    }

    const client = await pool.connect();

    try {
      await client.query(
        `
        UPDATE gothelph.orders
        SET status_id = $1
        WHERE id = $2
        `,
        [statusId, id],
      );

      return NextResponse.json({
        ok: true,
        orderId: id,
        statusId,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return NextResponse.json(
      { error: "Ошибка обновления статуса" },
      { status: 500 },
    );
  }
}
