import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SettingsEffect } from "@/components/layout/SettingsEffect";
import { getContent } from "@/content/localized";
import { toSearchItems } from "@/lib/search";
import { SITE } from "@/lib/site";
import { LOCALES, OG_LOCALES, getMessages, isLocale } from "@/i18n";
import { LocaleProvider } from "@/i18n/client";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: SITE.name, template: `%s · ${SITE.name}` },
    description: t.site.tagline,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: SITE.name,
      description: t.site.tagline,
      locale: OG_LOCALES[locale],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const headerAreas = content.areasInLearningOrder.map((a) => ({ id: a.id, name: a.name, number: a.number }));
  const searchItems = toSearchItems(content.concepts);

  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <LocaleProvider locale={locale}>
          <SettingsEffect />
          <Header areas={headerAreas} searchItems={searchItems} totalConcepts={content.concepts.length} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </LocaleProvider>
      </body>
    </html>
  );
}
