import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-4xl font-semibold">That page fell off the desk</h1>
      <p className="mt-3 max-w-md text-muted">
        Like a token past the context window, it is not here. Try the search (Ctrl+K) or go back to the roadmap.
      </p>
      <Link href="/" className={`${buttonClass("primary", "lg")} mt-8`}>
        Back to the roadmap
      </Link>
    </div>
  );
}
