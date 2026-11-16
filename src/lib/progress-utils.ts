/** Pure helpers over the persisted progress state (no React, no browser APIs). */

/** Count of used concepts, optionally within one area (ids look like "llm-05"). */
export function countUsed(used: Record<string, string>, areaId?: string) {
  const keys = Object.keys(used);
  if (!areaId) return keys.length;
  return keys.filter((k) => k.startsWith(`${areaId}-`)).length;
}

/** Number of consecutive days (ending today) with at least one concept marked. */
export function streakDays(used: Record<string, string>) {
  const days = new Set(Object.values(used).map((iso) => iso.slice(0, 10)));
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
