import crypto from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { ensureProgressTables, getSql } from "./db";

export const SESSION_COOKIE = "roadmap-session";
const SESSION_TTL_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(keyHex, "hex");
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createUserAccount(params: {
  email: string;
  name: string;
  password: string;
}): Promise<SessionUser> {
  await ensureProgressTables();
  const sql = getSql();
  const normalizedEmail = params.email.trim().toLowerCase();
  const trimmedName = params.name.trim();
  const userId = `usr_${crypto.randomUUID().replace(/-/g, "")}`;
  const passwordHash = hashPassword(params.password);

  const existing = (await sql`
    SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1
  `) as Array<{ id: string }>;
  if (existing.length > 0) {
    throw new Error("EMAIL_TAKEN");
  }

  const rows = (await sql`
    INSERT INTO users (id, email, name, password_hash)
    VALUES (${userId}, ${normalizedEmail}, ${trimmedName}, ${passwordHash})
    RETURNING id, email, name, created_at
  `) as Array<{ id: string; email: string; name: string; created_at: Date | string }>;

  const row = rows[0]!;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
  };
}

export async function authenticateUser(params: {
  email: string;
  password: string;
}): Promise<SessionUser | null> {
  await ensureProgressTables();
  const sql = getSql();
  const normalizedEmail = params.email.trim().toLowerCase();

  const rows = (await sql`
    SELECT id, email, name, password_hash, created_at
    FROM users
    WHERE email = ${normalizedEmail}
    LIMIT 1
  `) as Array<{
    id: string;
    email: string;
    name: string;
    password_hash: string;
    created_at: Date | string;
  }>;

  const row = rows[0];
  if (!row) return null;
  if (!verifyPassword(params.password, row.password_hash)) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
  };
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  await ensureProgressTables();
  const sql = getSql();
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (${tokenHash}, ${userId}, ${expiresAt.toISOString()})
  `;

  return { token, expiresAt };
}

export async function getUserFromSessionToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null;
  await ensureProgressTables();
  const sql = getSql();
  const tokenHash = hashToken(token);

  const rows = (await sql`
    SELECT u.id, u.email, u.name, u.created_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > NOW()
    LIMIT 1
  `) as Array<{ id: string; email: string; name: string; created_at: Date | string }>;

  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
  };
}

export async function getSessionUser(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return getUserFromSessionToken(token);
}

export async function deleteSessionByToken(token: string | undefined | null): Promise<void> {
  if (!token) return;
  await ensureProgressTables();
  const sql = getSql();
  const tokenHash = hashToken(token);
  await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`;
}

function isHttps(req: NextRequest): boolean {
  const proto = req.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0]?.trim() === "https";
  return req.nextUrl.protocol === "https:";
}

export function attachSessionCookie(req: NextRequest, res: NextResponse, token: string, expiresAt: Date): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(req),
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(req: NextRequest, res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps(req),
    path: "/",
    maxAge: 0,
  });
}
