import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SettingsEffect } from "@/components/layout/SettingsEffect";
import { areasInLearningOrder, concepts, TOTAL_CONCEPTS } from "@/content";
import { toSearchItems } from "@/lib/search";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.tagline,
  openGraph: { type: "website", siteName: SITE.name, title: SITE.name, description: SITE.tagline },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headerAreas = areasInLearningOrder.map((a) => ({ id: a.id, name: a.name, number: a.number }));
  const searchItems = toSearchItems(concepts);

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SettingsEffect />
        <Header areas={headerAreas} searchItems={searchItems} totalConcepts={TOTAL_CONCEPTS} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
