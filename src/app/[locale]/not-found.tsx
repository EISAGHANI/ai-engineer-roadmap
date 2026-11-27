"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { useLocalePath, useT } from "@/i18n/client";

export default function NotFound() {
  const t = useT();
  const lp = useLocalePath();
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-4xl font-semibold">{t.notFound.title}</h1>
      <p className="mt-3 max-w-md text-muted">{t.notFound.text}</p>
      <Link href={lp("/")} className={`${buttonClass("primary", "lg")} mt-8`}>
        {t.notFound.back}
      </Link>
    </div>
  );
}
