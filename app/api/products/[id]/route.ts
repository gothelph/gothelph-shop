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
        p.description,
        pv.id AS product_variant_id
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      LEFT JOIN product_variants pv ON pv.product_id = p.id
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const { id } = await params;

    const { name, price, description, categoryId, image } = body;

    await pool.query(
      `
      UPDATE products
      SET name = $1,
          price = $2,
          description = $3,
          category_id = $4
      WHERE id = $5
      `,
      [name, price, description, categoryId, id],
    );

    if (image) {
      await pool.query(
        `
        UPDATE product_images
        SET image_url = $1
        WHERE product_id = $2 AND is_main = true
        `,
        [image, id],
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Ошибка обновления товара" },
      { status: 500 },
    );
  }
}
