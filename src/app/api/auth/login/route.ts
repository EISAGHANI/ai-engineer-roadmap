import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { attachSessionCookie, authenticateUser, createSession } from "@/lib/auth";
import { getProgressFromDb, mergeProgressInDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(160),
  password: z.string().min(1, "Password is required").max(128),
  progress: z
    .object({
      used: z.record(z.string().min(1).max(200), z.string()).default({}),
      prereqs: z.record(z.string().min(1).max(200), z.boolean()).default({}),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid login details";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const { email, password, progress } = parsed.data;
    const user = await authenticateUser({ email, password });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (progress && (Object.keys(progress.used).length > 0 || Object.keys(progress.prereqs).length > 0)) {
      await mergeProgressInDb(user.id, progress);
    }

    const snapshot = await getProgressFromDb(user.id);
    const session = await createSession(user.id);

    const res = NextResponse.json({ user, progress: snapshot });
    attachSessionCookie(req, res, session.token, session.expiresAt);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not sign in";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
