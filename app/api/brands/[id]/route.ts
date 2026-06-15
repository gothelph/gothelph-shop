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
        b.name AS brands,
        pi.image_url AS image,
        p.description,
        pv.id AS product_variant_id
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      WHERE b.id::text = $1
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
      productVariantId: row.product_variant_id,
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
