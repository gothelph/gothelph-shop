import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO gothelph.users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [username, email, hash],
    );

    // TODO: добавить роль user в gothelph.user_roles
    const userId = result.rows[0].id;
    await pool.query(
      `INSERT INTO gothelph.user_roles (user_id, role_id)
       SELECT $1, id FROM gothelph.roles WHERE name='user'`,
      [userId],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 },
    );
  }
}
