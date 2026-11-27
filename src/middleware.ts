import { NextResponse, type NextRequest } from "next/server";

/**
 * English keeps the original, unprefixed URLs; German lives under /de.
 * Internally every page sits under the [locale] segment, so unprefixed paths are
 * rewritten to /en/..., and explicit /en/... URLs redirect to the unprefixed form.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/de" || pathname.startsWith("/de/")) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (robots.txt, sitemap.xml, images).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
