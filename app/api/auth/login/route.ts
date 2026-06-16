// app/api/auth/login/route.ts
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { errorResponse, okResponse } from "@/lib/utils/api-response";
import { setRefreshTokenCookie } from "@/lib/utils/auth-cookies";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";
import { hashToken } from "@/lib/utils/token-hash";

export interface LoginResponse {
  data?: {
    accessToken: string;
    roles: string[];
  };
  error?: {
    status: number;
    code: string;
    message: string;
  };
}

export async function POST(req: Request) {
  const body = await req.json();
  // const parsed = validateLoginPayload(body);

  // if (!parsed.valid) {
  //   return errorResponse({
  //     status: 400,
  //     code: "VALIDATION_ERROR",
  //     message: "Invalid login payload",
  //     details: parsed.details,
  //   });
  // }

  const { login, password } = body;

  try {
    const res = await pool.query(
      `SELECT u.*,
              COALESCE(
                array_agg(r.name) FILTER (WHERE r.name IS NOT NULL),
                '{}'
              ) AS roles
       FROM gothelph.users u
       LEFT JOIN gothelph.user_roles ur ON ur.user_id = u.id
       LEFT JOIN gothelph.roles r ON r.id = ur.role_id
       WHERE u.email = $1 or u.phone = $1
       GROUP BY u.id`,
      [login],
    );
    const user = res.rows[0];
    if (!user)
      return errorResponse({
        status: 401,
        code: "AUTH_INVALID_CREDENTIALS",
        message: "Invalid login or password",
      });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return errorResponse({
        status: 401,
        code: "AUTH_INVALID_CREDENTIALS",
        message: "Invalid login or password",
      });

    console.debug("Login success:", user);
    const accessToken = generateAccessToken(user.id, user.username, user.roles);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = hashToken(refreshToken);
    const userAgent = req.headers.get("user-agent");
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    await pool.query(
      `INSERT INTO gothelph.user_sessions (
         user_id,
         refresh_token_hash,
         user_agent,
         ip_address,
         expires_at
       )
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')`,
      [user.id, refreshTokenHash, userAgent, ipAddress ?? null],
    );

    const response = okResponse({ data: { accessToken, roles: user.roles } });
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
