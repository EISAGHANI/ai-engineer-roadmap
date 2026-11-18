import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { attachSessionCookie, createSession, createUserAccount } from "@/lib/auth";
import { getProgressFromDb, mergeProgressInDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email address").max(160),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
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
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid registration details";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const { name, email, password, progress } = parsed.data;
    const user = await createUserAccount({ name, email, password });

    if (progress && (Object.keys(progress.used).length > 0 || Object.keys(progress.prereqs).length > 0)) {
      await mergeProgressInDb(user.id, progress);
    }

    const snapshot = await getProgressFromDb(user.id);
    const session = await createSession(user.id);

    const res = NextResponse.json({ user, progress: snapshot });
    attachSessionCookie(req, res, session.token, session.expiresAt);
    return res;
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Could not create account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
