import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, deleteSessionByToken, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    await deleteSessionByToken(token);
    const res = NextResponse.json({ ok: true });
    clearSessionCookie(req, res);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not sign out";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
