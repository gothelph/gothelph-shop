import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_TOKEN_MISSING"
  | "AUTH_TOKEN_INVALID"
  | "AUTH_FORBIDDEN"
  | "REGISTRATION_FAILED"
  | "INTERNAL_ERROR"
  | "INVALID_USER_ID"
  | "USER_NOT_FOUND"
  | "ROLE_NOT_FOUND"
  | "INVALID_ROLE";

interface ErrorResponseOptions {
  status: number;
  code: ApiErrorCode;
  message: string;
  details?: unknown;
}

export const errorResponse = ({
  status,
  code,
  message,
  details,
}: ErrorResponseOptions) => {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status },
  );
};

export const okResponse = <T>(payload: T, status = 200) => {
  return NextResponse.json(payload, { status });
};
