import { notFound } from "next/navigation";

/** Any path that matches no route still renders the localized 404 inside the layout. */
export default function CatchAll() {
  notFound();
}
