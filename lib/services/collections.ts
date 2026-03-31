import pool from "@/lib/db";
import { collectionsData } from "@/data/collections";
import { Collection } from "@/types/collection";

type DbRow = {
  collection_id: string;
  collection_title: string;
  collection_description: string;
  item_name: string | null;
  item_type: string | null;
  item_price: number | string | null;
};

export type CollectionsResult = {
  data: Collection[];
  source: "db" | "fallback";
  warnings: string[];
};

type TableMeta = {
  exists: boolean;
  columns: Set<string>;
};

async function getTableMeta(tableName: string): Promise<TableMeta> {
  const tableRes = await pool.query<{ exists: boolean }>(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = current_schema()
          AND table_name = $1
      ) AS exists
    `,
    [tableName],
  );

  const exists = Boolean(tableRes.rows[0]?.exists);

  if (!exists) {
    return { exists: false, columns: new Set() };
  }

  const columnsRes = await pool.query<{ column_name: string }>(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = $1
    `,
    [tableName],
  );

  return {
    exists: true,
    columns: new Set(columnsRes.rows.map((row) => row.column_name)),
  };
}

function mapRowsToCollections(rows: DbRow[]): Collection[] {
  const collections = new Map<string, Collection>();

  for (const row of rows) {
    if (!collections.has(row.collection_id)) {
      collections.set(row.collection_id, {
        id: row.collection_id,
        title: row.collection_title,
        description: row.collection_description,
        subcollections: [
          {
            id: `${row.collection_id}-base`,
            title: "Основная линейка",
            description: "Товары коллекции",
            items: [],
          },
        ],
      });
    }

    const collection = collections.get(row.collection_id);

    if (!collection || !row.item_name) {
      continue;
    }

    collection.subcollections[0].items.push({
      name: row.item_name,
      type: row.item_type || "Без категории",
      price: Number(row.item_price) || 0,
    });
  }

  return Array.from(collections.values());
}

async function loadCollectionsFromDb(): Promise<CollectionsResult> {
  const warnings: string[] = [];

  const [
    collectionsMeta,
    productCollectionsMeta,
    productsMeta,
    categoriesMeta,
  ] = await Promise.all([
    getTableMeta("collections"),
    getTableMeta("product_collections"),
    getTableMeta("products"),
    getTableMeta("categories"),
  ]);

  if (!collectionsMeta.exists) {
    throw new Error("Таблица collections не найдена в current_schema().");
  }

  const collectionTitleExpr = collectionsMeta.columns.has("name")
    ? "c.name"
    : collectionsMeta.columns.has("title")
      ? "c.title"
      : "c.id::text";

  const collectionDescriptionExpr = collectionsMeta.columns.has("description")
    ? "COALESCE(c.description, '')"
    : "''";

  const canJoinProducts =
    productCollectionsMeta.exists &&
    productsMeta.exists &&
    productCollectionsMeta.columns.has("collection_id") &&
    productCollectionsMeta.columns.has("product_id") &&
    productsMeta.columns.has("id");

  const productNameExpr =
    canJoinProducts && productsMeta.columns.has("name") ? "p.name" : "NULL";

  const priceExpr = canJoinProducts
    ? productsMeta.columns.has("base_price")
      ? "p.base_price"
      : productsMeta.columns.has("price")
        ? "p.price"
        : "0"
    : "0";

  const canJoinCategories =
    canJoinProducts &&
    categoriesMeta.exists &&
    productsMeta.columns.has("category_id") &&
    categoriesMeta.columns.has("id") &&
    categoriesMeta.columns.has("name");

  const categoryExpr = canJoinCategories ? "cat.name" : "NULL";

  const joins = [
    canJoinProducts
      ? "LEFT JOIN product_collections pc ON pc.collection_id = c.id LEFT JOIN products p ON p.id = pc.product_id"
      : "",
    canJoinCategories
      ? "LEFT JOIN categories cat ON cat.id = p.category_id"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!canJoinProducts) {
    warnings.push(
      "Связка product_collections/products недоступна или неполная — загружены только коллекции без товаров.",
    );
  }

  const query = `
    SELECT
      c.id::text AS collection_id,
      ${collectionTitleExpr} AS collection_title,
      ${collectionDescriptionExpr} AS collection_description,
      ${productNameExpr} AS item_name,
      ${categoryExpr} AS item_type,
      ${priceExpr} AS item_price
    FROM collections c
    ${joins}
    ORDER BY 2, 4 NULLS LAST
  `;

  const { rows } = await pool.query<DbRow>(query);

  if (!rows.length) {
    throw new Error("Таблица collections пустая.");
  }

  return {
    data: mapRowsToCollections(rows),
    source: "db",
    warnings,
  };
}

export async function getCollectionsData(
  allowFallback = true,
): Promise<CollectionsResult> {
  try {
    return await loadCollectionsFromDb();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown DB error";

    if (!allowFallback) {
      throw new Error(`Не удалось получить коллекции из БД. ${message}`);
    }

    return {
      data: collectionsData,
      source: "fallback",
      warnings: [message],
    };
  }
}
