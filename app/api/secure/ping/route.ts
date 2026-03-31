import { okResponse } from "@/lib/utils/api-response";

export async function GET() {
  return okResponse({ ok: true, message: "Secure pong" });
}
