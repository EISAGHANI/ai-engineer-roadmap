import { NextResponse } from "next/server";
import { checkDbHealth } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await checkDbHealth();
    return NextResponse.json({
      ...status,
      branch: process.env.NEON_BRANCH ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database health check failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
