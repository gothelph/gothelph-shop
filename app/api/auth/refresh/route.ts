import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/utils/jwt";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    const payload = verifyToken(refreshToken) as { userId: number };

    const newAccessToken = generateAccessToken(payload.userId, []);

    const newRefreshToken = generateRefreshToken(payload.userId);

    const response = NextResponse.json({ accessToken: newAccessToken });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
