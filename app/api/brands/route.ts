import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const brands = await db.query(`
    SELECT 
      b.id,
      b.name FROM brands b;
  `);

  return NextResponse.json(brands.rows);
}
