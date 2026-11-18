import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import {
  clearProgressInDb,
  getProgressFromDb,
  replaceProgressInDb,
  setConceptUsedInDb,
  setPrereqInDb,
} from "@/lib/db";

export const dynamic = "force-dynamic";

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
  used: z.record(z.string().min(1).max(200), z.string()),
  prereqs: z.record(z.string().min(1).max(200), z.boolean()),
});

async function resolveProfileId(req: NextRequest): Promise<string | null> {
  const user = await getSessionUser(req);
  if (user) return user.id;

  const fromQuery = req.nextUrl.searchParams.get("profile")?.trim();
  if (fromQuery && /^[a-zA-Z0-9_-]{1,64}$/.test(fromQuery)) {
    return fromQuery;
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const profileId = await resolveProfileId(req);
    if (!profileId) {
      return NextResponse.json({
        used: {},
        prereqs: {},
        profileId: null,
        authenticated: false,
        synced: false,
      });
    }

    const snapshot = await getProgressFromDb(profileId);
    return NextResponse.json({
      ...snapshot,
      profileId,
      authenticated: true,
      synced: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const profileId = await resolveProfileId(req);
    if (!profileId) {
      return NextResponse.json({ ok: false, synced: false, reason: "unauthenticated" }, { status: 200 });
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    if (data.type === "concept") {
      await setConceptUsedInDb(profileId, data.id, data.value, data.usedAt);
    } else {
      await setPrereqInDb(profileId, data.id, data.value);
    }

    return NextResponse.json({ ok: true, synced: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const profileId = await resolveProfileId(req);
    if (!profileId) {
      return NextResponse.json({ ok: false, synced: false, reason: "unauthenticated" }, { status: 200 });
    }

    const body = await req.json();
    const parsed = putSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    await replaceProgressInDb(profileId, parsed.data);
    return NextResponse.json({ ok: true, synced: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to replace progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const profileId = await resolveProfileId(req);
    if (!profileId) {
      return NextResponse.json({ ok: false, synced: false, reason: "unauthenticated" }, { status: 200 });
    }

    await clearProgressInDb(profileId);
    return NextResponse.json({ ok: true, synced: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reset progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
