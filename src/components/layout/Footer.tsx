import Link from "next/link";
import { SITE } from "@/lib/site";
import { getMessages, localePath, type Locale } from "@/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale).footer;
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p className="prose-max">
          {t.basedOn}{" "}
          <a href={SITE.roadmapUrl} className="text-text underline-offset-4 hover:underline" rel="noopener">
            AI Engineer Roadmap
          </a>{" "}
          {t.by}{" "}
          <a href={SITE.roadmapAuthorUrl} className="text-text underline-offset-4 hover:underline" rel="noopener">
            @ai.learnvora
          </a>{" "}
          {t.rest}
        </p>
        <div className="flex items-center gap-4">
          <Link href={localePath(locale, "/about")} className="hover:text-text">
            {t.about}
          </Link>
          <a href={SITE.repoUrl} className="hover:text-text" rel="noopener">
            GitHub
          </a>
          <span>
            {t.builtBy}{" "}
            <a href={SITE.authorUrl} className="text-text hover:underline" rel="noopener">
              {SITE.authorName}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
