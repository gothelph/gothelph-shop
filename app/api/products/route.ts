import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get("collection_id");
  const categoryId = searchParams.get("category_id");

  try {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.price,
        c.name AS category,
        (
          SELECT pi.image_url 
          FROM product_images pi 
          WHERE pi.product_id = p.id AND pi.is_main = true 
          LIMIT 1
        ) AS image
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
    `;

    const params: string[] = [];
    const conditions: string[] = [];

    if (collectionId) {
      query += `
        LEFT JOIN product_collections pc ON pc.product_id = p.id
      `;
      conditions.push(`pc.collection_id::text = $${params.length + 1}`);
      params.push(collectionId);
    }

    if (categoryId) {
      conditions.push(`p.category_id::text = $${params.length + 1}`);
      params.push(categoryId);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.id DESC";

    const result = await pool.query(query, params);

    const items = result.rows.map((row) => ({
      id: String(row.id),
      name: row.name,
      type: row.category ?? "unknown",
      price: Number(row.price),
      image: row.image || "/placeholder.png",
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error("PRODUCTS API ERROR:", error);

    return NextResponse.json(
      { error: "Ошибка загрузки товаров" },
      { status: 500 },
    );
  }
}
