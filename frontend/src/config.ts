import { Pathnames, LocalePrefix } from "next-intl/routing";

export const defaultLocale = "id" as const;
export const locales = ["id", "en"] as const;

export const pathnames = {
  "/": "/",
  "/about": {
    en: "/about",
    id: "/tentang",
  },
} satisfies Pathnames<typeof locales>;

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${port}`;
