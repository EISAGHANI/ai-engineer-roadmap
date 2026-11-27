import type { Metadata } from "next";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return pageMetadata(locale, "/about", { title: t.about.metaTitle, description: t.about.metaDescription });
}

const link = "text-accent underline-offset-4 hover:underline";

export default async function AboutPage({ params }: Params) {
  const t = getMessages((await params).locale as Locale).about;
  const edition = getMessages((await params).locale as Locale).site.edition;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold sm:text-5xl">{t.title}</h1>

      <section className="prose-max mt-6 space-y-4">
        <h2 className="text-xl font-semibold">{t.roadmapTitle}</h2>
        <p>
          {t.roadmapBefore}
          <a href={SITE.roadmapUrl} className={link} rel="noopener">
            AI Engineer Roadmap
          </a>
          {t.roadmapAfter(SITE.roadmapAuthor, edition)}
        </p>

        <h2 className="text-xl font-semibold">{t.whyTitle}</h2>
        <p>{t.whyText}</p>

        <h2 className="text-xl font-semibold">{t.progressTitle}</h2>
        <p>{t.progressText}</p>

        {t.languageTitle && (
          <>
            <h2 className="text-xl font-semibold">{t.languageTitle}</h2>
            <p>{t.languageText}</p>
          </>
        )}

        <h2 className="text-xl font-semibold">{t.builtTitle}</h2>
        <p>
          {t.builtBefore}
          <a href={SITE.repoUrl} className={link} rel="noopener">
            GitHub
          </a>
          {t.builtAfter}
        </p>

        <h2 className="text-xl font-semibold">{t.whoTitle}</h2>
        <p>
          {t.whoBefore}
          <a href={SITE.authorUrl} className={link} rel="noopener">
            {SITE.authorName}
          </a>
          {t.whoAfter}
        </p>
      </section>
    </div>
  );
}
