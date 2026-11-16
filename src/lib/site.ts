/**
 * Resolve the public site URL robustly:
 * 1. NEXT_PUBLIC_SITE_URL (with or without "https://")
 * 2. Vercel's automatic production / deployment host
 * 3. localhost for development
 * Never throws: a bad value falls through to the next option.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      // try the next candidate
    }
  }
  return "http://localhost:3000";
}

export const SITE = {
  name: "AI Engineer Roadmap",
  tagline: "8 areas · 20 concepts each · 160 things to master, explained so anyone can follow.",
  url: resolveSiteUrl(),
  githubOwner: process.env.NEXT_PUBLIC_GITHUB_OWNER?.trim() || "EISAGHANI",
  repoUrl: "https://github.com/EISAGHANI/ai-engineer-roadmap",
  authorName: "Mohammad Eisa",
  authorUrl: "https://github.com/EISAGHANI",
  roadmapAuthor: "@ai.learnvora (LearnVora)",
  roadmapAuthorUrl: "https://www.instagram.com/ai.learnvora/",
  roadmapUrl: "https://www.instagram.com/ai.learnvora/",
  roadmapEdition: "Edition · November 2026",
};
