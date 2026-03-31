// app/api/auth/login/route.ts
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { errorResponse, okResponse } from "@/lib/utils/api-response";
import { setRefreshTokenCookie } from "@/lib/utils/auth-cookies";
import { validateLoginPayload } from "@/lib/utils/auth-validation";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";
import { hashToken } from "@/lib/utils/token-hash";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = validateLoginPayload(body);

  if (!parsed.valid) {
    return errorResponse({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid login payload",
      details: parsed.details,
    });
  }

  const { email, password } = parsed.data;

  try {
    const res = await pool.query(
      `SELECT u.*,
              COALESCE(
                array_agg(r.name) FILTER (WHERE r.name IS NOT NULL),
                '{}'
              ) AS roles
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id
       WHERE u.email = $1
       GROUP BY u.id`,
      [email],
    );

    const user = res.rows[0];
    if (!user)
      return errorResponse({
        status: 401,
        code: "AUTH_INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return errorResponse({
        status: 401,
        code: "AUTH_INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });

    const accessToken = generateAccessToken(user.id, user.roles);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = hashToken(refreshToken);
    const userAgent = req.headers.get("user-agent");
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    await pool.query(
      `INSERT INTO user_sessions (
         user_id,
         refresh_token_hash,
         user_agent,
         ip_address,
         expires_at
       )
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')`,
      [user.id, refreshTokenHash, userAgent, ipAddress ?? null],
    );

    const response = okResponse({ accessToken, roles: user.roles });
    setRefreshTokenCookie(response, refreshToken);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse({
      status: 500,
      code: "INTERNAL_ERROR",
      message: "Login failed due to server error",
    });
  }
}
