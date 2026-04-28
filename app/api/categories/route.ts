import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await db.query(`
    SELECT 
      c.id,
      c.name,
      (
        SELECT pi.image_url
        FROM products p
        JOIN product_images pi ON pi.product_id = p.id
        WHERE p.category_id = c.id
        LIMIT 1
      ) AS image
    FROM categories c;
  `);

  return NextResponse.json(categories.rows);
}
