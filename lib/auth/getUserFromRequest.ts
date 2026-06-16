import { verifyToken } from "@/lib/utils/jwt";

export function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = verifyToken(token) as {
      userId: number;
      login: string;
      roles: string[];
    };

    return decoded;
  } catch {
    return null;
  }
}
