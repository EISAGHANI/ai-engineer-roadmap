/** Server-side helpers for public GitHub repository metadata. Call only from server components. */

export interface RepoStats {
  fullName: string;
  htmlUrl: string;
  description: string | null;
  stars: number;
  language: string | null;
  pushedAt: string;
  homepage: string | null;
}

/**
 * Fetch public repository metadata with ISR (revalidated hourly).
 * Returns null when the repo does not exist or the API is unavailable, so pages
 * always render from the static project data.
 */
export async function getRepoStats(fullName: string | undefined): Promise<RepoStats | null> {
  if (!fullName) return null;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ai-engineer-roadmap-site",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      full_name: string;
      html_url: string;
      description: string | null;
      stargazers_count: number;
      language: string | null;
      pushed_at: string;
      homepage: string | null;
    };
    return {
      fullName: data.full_name,
      htmlUrl: data.html_url,
      description: data.description,
      stars: data.stargazers_count,
      language: data.language,
      pushedAt: data.pushed_at,
      homepage: data.homepage,
    };
  } catch {
    return null;
  }
}

export async function getRepoReadme(fullName: string | undefined): Promise<string | null> {
  if (!fullName) return null;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw+json",
    "User-Agent": "ai-engineer-roadmap-site",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Fetch stats for many repos at once; de-duplicates identical repo names. */
export async function getRepoStatsMap(fullNames: Array<string | undefined>) {
  const unique = Array.from(new Set(fullNames.filter((n): n is string => Boolean(n))));
  const results = await Promise.all(unique.map((n) => getRepoStats(n)));
  const map: Record<string, RepoStats | null> = {};
  unique.forEach((n, i) => {
    map[n] = results[i];
  });
  return map;
}
