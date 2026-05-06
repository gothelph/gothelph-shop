import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/utils/auth-guard";

export async function GET(request: Request) {
  const auth = authenticateRequest(request, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT
         p.id::text AS id,
         p.name,
         p.price,
         p.category_id::text AS "categoryId",
         p.description,
         pi.image_url AS "imageUrl",
         pc.collection_id::text AS "collectionId"
       FROM products p
       LEFT JOIN LATERAL (
         SELECT image_url
         FROM product_images
         WHERE product_id = p.id AND is_main = true
         LIMIT 1
       ) pi ON true
       LEFT JOIN LATERAL (
         SELECT collection_id
         FROM product_collections
         WHERE product_id = p.id
         LIMIT 1
       ) pc ON true
       WHERE p.id::text = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    const product = result.rows[0];

    return NextResponse.json({
      ...product,
      price: Number(product.price),
    });
  } catch (error) {
    console.error("GET ADMIN PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки товара" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { name, price, categoryId, description, imageUrl, collectionId } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "name and price are required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const productResult = await client.query(
        `INSERT INTO products (name, price, category_id, description)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [name, price, categoryId || null, description || null]
      );

      const productId = productResult.rows[0].id;

      if (imageUrl) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, is_main)
           VALUES ($1, $2, true)`,
          [productId, imageUrl]
        );
      }

      if (collectionId) {
        await client.query(
          `INSERT INTO product_collections (product_id, collection_id)
           VALUES ($1, $2)`,
          [productId, collectionId]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({ id: String(productId), name, price });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Ошибка создания товара" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = authenticateRequest(request, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const {
      id,
      name,
      price,
      categoryId,
      collectionId,
      description,
      imageUrl,
    } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "id and name are required" },
        { status: 400 },
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const productResult = await client.query(
        `UPDATE products 
         SET name = $1, price = $2, category_id = $3, description = $4
         WHERE id::text = $5
         RETURNING id`,
        [name, price, categoryId || null, description || null, id],
      );

      if (productResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
      }

      if (imageUrl) {
        const imageResult = await client.query(
          `UPDATE product_images
           SET image_url = $1
           WHERE product_id::text = $2 AND is_main = true`,
          [imageUrl, id],
        );

        if (imageResult.rowCount === 0) {
          await client.query(
            `INSERT INTO product_images (product_id, image_url, is_main)
             VALUES ($1, $2, true)`,
            [productResult.rows[0].id, imageUrl],
          );
        }
      } else {
        await client.query(
          `DELETE FROM product_images
           WHERE product_id::text = $1 AND is_main = true`,
          [id],
        );
      }

      await client.query(
        `DELETE FROM product_collections
         WHERE product_id::text = $1`,
        [id],
      );

      if (collectionId) {
        await client.query(
          `INSERT INTO product_collections (product_id, collection_id)
           VALUES ($1, $2)`,
          [productResult.rows[0].id, collectionId],
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({ ok: true });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Ошибка обновления товара" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = authenticateRequest(request, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await pool.query(`DELETE FROM products WHERE id::text = $1`, [id]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Ошибка удаления товара" },
      { status: 500 }
    );
  }
}
