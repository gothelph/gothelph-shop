import { okResponse } from "@/lib/utils/api-response";
import { authenticateRequest } from "@/lib/utils/auth-guard";

export async function GET(req: Request) {
  const auth = authenticateRequest(req);
  if (!auth.ok) {
    return auth.response;
  }

  return okResponse({
    userId: auth.user.userId,
    roles: auth.user.roles ?? [],
    login: auth.user.login,
  });
}
