import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  clearProgressInDb,
  getProgressFromDb,
  replaceProgressInDb,
  setConceptUsedInDb,
  setPrereqInDb,
} from "@/lib/db";

export const dynamic = "force-dynamic";

const PROFILE_COOKIE = "roadmap-profile";
const DEFAULT_PROFILE = "default";

const patchSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("concept"),
    id: z.string().min(1).max(200),
    value: z.boolean(),
    usedAt: z.string().datetime().optional(),
  }),
  z.object({
    type: z.literal("prereq"),
    id: z.string().min(1).max(200),
    value: z.boolean(),
  }),
]);

const putSchema = z.object({
  used: z.record(z.string().min(1).max(200), z.string().datetime()),
  prereqs: z.record(z.string().min(1).max(200), z.boolean()),
});

function getProfileId(req: NextRequest): string {
  const fromQuery = req.nextUrl.searchParams.get("profile");
  const fromCookie = req.cookies.get(PROFILE_COOKIE)?.value;
  const raw = (fromQuery || fromCookie || DEFAULT_PROFILE).trim();
  return /^[a-zA-Z0-9_-]{1,64}$/.test(raw) ? raw : DEFAULT_PROFILE;
}

export async function GET(req: NextRequest) {
  try {
    const profileId = getProfileId(req);
    const snapshot = await getProgressFromDb(profileId);
    return NextResponse.json({ ...snapshot, profileId, synced: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    const profileId = getProfileId(req);
    const data = parsed.data;
    if (data.type === "concept") {
      await setConceptUsedInDb(profileId, data.id, data.value, data.usedAt);
    } else {
      await setPrereqInDb(profileId, data.id, data.value);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = putSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    const profileId = getProfileId(req);
    await replaceProgressInDb(profileId, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to replace progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profileId = getProfileId(req);
    await clearProgressInDb(profileId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reset progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
