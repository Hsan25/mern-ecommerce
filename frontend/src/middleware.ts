import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { localePrefix, defaultLocale, locales, pathnames } from "./config";
export const intlMiddleware = createIntlMiddleware({
  locales, 
  defaultLocale,
  localePrefix,
  pathnames,
});

export async function middleware(req: NextRequest) {
  return intlMiddleware(req);
}
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
