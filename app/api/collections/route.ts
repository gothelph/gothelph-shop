import { NextResponse } from "next/server";
import { getCollectionsData } from "@/lib/services/collections";

export async function GET() {
  try {
    const result = await getCollectionsData(false);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown collections error";

    return NextResponse.json(
      {
        data: [],
        source: "db-error",
        error: message,
      },
      { status: 500 },
    );
  }
}
