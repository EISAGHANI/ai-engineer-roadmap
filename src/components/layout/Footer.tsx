import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p className="prose-max">
          Based on the{" "}
          <a href={SITE.roadmapUrl} className="text-text underline-offset-4 hover:underline" rel="noopener">
            AI Engineer Roadmap
          </a>{" "}
          by{" "}
          <a href={SITE.roadmapAuthorUrl} className="text-text underline-offset-4 hover:underline" rel="noopener">
            @ai.learnvora
          </a>{" "}
          (LearnVora), Edition November 2026. 8 areas · 20 concepts each · 160 things to master. This site is a
          learning companion to that roadmap, not a replacement.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-text">
            About
          </Link>
          <a href={SITE.repoUrl} className="hover:text-text" rel="noopener">
            GitHub
          </a>
          <span>
            Built by{" "}
            <a href={SITE.authorUrl} className="text-text hover:underline" rel="noopener">
              {SITE.authorName}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
