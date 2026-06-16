import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/getUserFromRequest";

export async function POST(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const { name, email, phone } = data;

  console.log(data);

  const result = await pool.query(
    `
    UPDATE gothelph.users
    SET username = $1,
        email = $2,
        phone = $3
    WHERE id = $4
    RETURNING id, username, email, phone
    `,
    [name, email, phone, user.userId],
  );

  return NextResponse.json({
    success: true,
    user: result.rows[0],
  });
}
