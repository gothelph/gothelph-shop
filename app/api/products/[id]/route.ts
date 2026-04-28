import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.name,
        p.price,
        c.name AS category,
        pi.image_url AS image,
        p.description
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      WHERE p.id::text = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    const row = result.rows[0];
    const item = {
      id: String(row.id),
      name: row.name,
      type: row.category ?? "unknown",
      price: Number(row.price),
      image: row.image || "/placeholder.png",
      description: row.description || "",
    };

    return NextResponse.json(item);
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);

    return NextResponse.json(
      { error: "Ошибка загрузки товара" },
      { status: 500 },
    );
  }
}
