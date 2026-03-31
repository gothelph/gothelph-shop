import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCollectionsData } from "@/lib/services/collections";
import { authenticateRequest } from "@/lib/utils/auth-guard";

export async function GET() {
  try {
    const result = await getCollectionsData(false);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown collections error";

    return NextResponse.json(
      {
        data: [],
        source: "db-error",
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const auth = authenticateRequest(req, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const body = (await req.json()) as {
    collectionId?: string;
    title?: string;
    description?: string;
  };

  if (!body.collectionId || !body.title) {
    return NextResponse.json(
      { error: "collectionId and title are required" },
      { status: 400 },
    );
  }

  try {
    const meta = await pool.query<{ column_name: string }>(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = current_schema()
         AND table_name = 'collections'`,
    );

    const columns = new Set(meta.rows.map((row) => row.column_name));
    const titleColumn = columns.has("name") ? "name" : columns.has("title") ? "title" : null;

    if (!titleColumn) {
      return NextResponse.json(
        { error: "collections table has no name/title column" },
        { status: 500 },
      );
    }

    const updates = [`${titleColumn} = $2`];
    const values: Array<string> = [body.collectionId, body.title];

    if (columns.has("description")) {
      updates.push(`description = $3`);
      values.push(body.description ?? "");
    }

    await pool.query(
      `UPDATE collections
       SET ${updates.join(", ")}
       WHERE id::text = $1`,
      values,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Collection update error", error);
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = authenticateRequest(req, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const body = (await req.json()) as {
    collectionId?: string;
    productName?: string;
  };

  if (!body.collectionId || !body.productName) {
    return NextResponse.json(
      { error: "collectionId and productName are required" },
      { status: 400 },
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productRes = await client.query<{ id: string }>(
      `SELECT p.id::text AS id
       FROM products p
       JOIN product_collections pc ON pc.product_id = p.id
       WHERE pc.collection_id::text = $1
         AND p.name = $2
       LIMIT 1`,
      [body.collectionId, body.productName],
    );

    const productId = productRes.rows[0]?.id;

    if (!productId) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await client.query(
      `DELETE FROM product_collections
       WHERE product_id::text = $1
         AND collection_id::text = $2`,
      [productId, body.collectionId],
    );

    await client.query(
      `DELETE FROM products
       WHERE id::text = $1
         AND NOT EXISTS (
           SELECT 1 FROM product_collections
           WHERE product_id::text = $1
         )`,
      [productId],
    );

    await client.query("COMMIT");

    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Product delete error", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  } finally {
    client.release();
  }
}
