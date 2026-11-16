import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Who made this site, where the roadmap comes from, and how it was built.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold sm:text-5xl">About this site</h1>

      <section className="prose-max mt-6 space-y-4">
        <h2 className="text-xl font-semibold">The roadmap</h2>
        <p>
          The content, structure and the 160 one-line definitions come from the{" "}
          <a href={SITE.roadmapUrl} className="text-accent underline-offset-4 hover:underline" rel="noopener">
            AI Engineer Roadmap
          </a>{" "}
          by {SITE.roadmapAuthor}, {SITE.roadmapEdition}. The roadmap is theirs; this site is a learning companion
          that adds simple explanations, real-world stories, engineering notes, interactive demos and progress
          tracking on top of it. If you find it useful, follow @ai.learnvora for one concept a day.
        </p>

        <h2 className="text-xl font-semibold">Why three explanations</h2>
        <p>
          Every concept is written for three readers in the same place: an eight-year-old (or any curious adult with no
          technical background), someone who learns best from a story about the real world, and an engineer who wants
          the precise version with code. The simple layer always comes first, and the engineering layer is one tap
          away. &ldquo;Simple mode&rdquo; in the header hides the engineering layer everywhere.
        </p>

        <h2 className="text-xl font-semibold">Progress</h2>
        <p>
          The roadmap asks you to tick a concept only when you have used it in code. Progress is saved in your browser
          and nowhere else; the My progress page lets you export and import it as a file.
        </p>

        <h2 className="text-xl font-semibold">How it is built</h2>
        <p>
          Next.js (App Router), TypeScript, Tailwind CSS, Motion for animation, Shiki for code highlighting, Zustand
          for progress, Fuse.js for search, deployed on Vercel. All 160 concepts live in typed data files that are
          validated on every build. The source is on{" "}
          <a href={SITE.repoUrl} className="text-accent underline-offset-4 hover:underline" rel="noopener">
            GitHub
          </a>
          ; corrections and better explanations are welcome as pull requests.
        </p>

        <h2 className="text-xl font-semibold">Who</h2>
        <p>
          Built by{" "}
          <a href={SITE.authorUrl} className="text-accent underline-offset-4 hover:underline" rel="noopener">
            {SITE.authorName}
          </a>
          , a software developer in Berlin moving into AI engineering, while working through the roadmap himself.
        </p>
      </section>
    </div>
  );
}
