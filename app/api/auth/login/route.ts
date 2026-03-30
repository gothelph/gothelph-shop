// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../lib/utils/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const res = await pool.query(
    `SELECT u.*, array_agg(r.name) as roles
     FROM gothelph.users u
     LEFT JOIN gothelph.user_roles ur ON ur.user_id = u.id
     LEFT JOIN gothelph.roles r ON r.id = ur.role_id
     WHERE u.email = $1
     GROUP BY u.id`,
    [email],
  );

  const user = res.rows[0];
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid)
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });

  const accessToken = generateAccessToken(user.id, user.roles);
  const refreshToken = generateRefreshToken(user.id);

  const response = NextResponse.json({ accessToken, roles: user.roles });

  // Ставим HttpOnly cookie для refresh token
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60, // 7 дней
  });

  return response;
}
