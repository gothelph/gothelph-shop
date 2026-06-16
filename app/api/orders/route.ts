import { getUserFromRequest } from "@/lib/auth/getUserFromRequest";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { PoolClient } from "pg";

interface UserData {
  name?: string;
  email?: string;
  phone: string;
  address?: string;
}

function generateHash(length = 12) {
  return randomBytes(length).toString("base64").slice(0, length);
}

async function createUser(client: PoolClient, userData: UserData) {
  const username = generateHash();
  const pass = generateHash();
  const hash = await bcrypt.hash(pass, 10);

  const { name, phone, email, address } = userData;
  const result = await client.query(
    `INSERT INTO gothelph.users (username, phone, password_hash, address, email, name)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, phone`,
    [username, phone, hash, address, email, name],
  );
  const userId = result.rows[0].id;

  await client.query(
    `INSERT INTO gothelph.user_roles (user_id, role_id)
       SELECT $1, id FROM gothelph.roles WHERE name='user'`,
    [userId],
  );

  return userId;
}

async function getUserByPhone(client: PoolClient, userData: UserData) {
  const result = await client.query(
    `SELECT id FROM gothelph.users WHERE phone = $1 LIMIT 1`,
    [userData.phone],
  );

  return result.rows[0];
}

async function getUserOrCreate(
  client: PoolClient,
  userData: UserData,
  userId?: number,
) {
  if (userId) return userId;

  const user = await getUserByPhone(client, userData);

  if (user) return user.id;

  userId = await createUser(client, userData);

  return userId;
}

/**
 * CREATE order
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = getUserFromRequest(request);

    const { items, comment, ...userData } = body;

    if (!items?.length) {
      return NextResponse.json(
        { error: "items are required" },
        { status: 400 },
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const userId = await getUserOrCreate(client, userData, user?.userId);

      const orderResult = await client.query(
        `
        INSERT INTO gothelph.orders (user_id, comment)
        VALUES ($1, $2)
        RETURNING id
        `,
        [userId, comment],
      );

      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        await client.query(
          `
          INSERT INTO gothelph.order_items
            (order_id, product_variant_id, quantity, price_at_purchase, product_id)
          VALUES
            ($1, $2, $3, $4, $5)
          `,
          [orderId, item.productVariantId, item.quantity, item.price, item.id],
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        orderId,
        success: true,
      });
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
      { status: 500 },
    );
  }
}
