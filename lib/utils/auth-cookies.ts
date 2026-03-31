import { NextResponse } from "next/server";

export const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const sharedRefreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export const setRefreshTokenCookie = (
  response: NextResponse,
  refreshToken: string,
) => {
  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    ...sharedRefreshCookieOptions,
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
};

export const clearRefreshTokenCookie = (response: NextResponse) => {
  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    ...sharedRefreshCookieOptions,
    maxAge: 0,
  });
};
