import { NextRequest, NextResponse } from "next/server";
import { adminMiddleware } from "./lib/middlewares/admin.middleware";
import { authMiddleware } from "./lib/middlewares/auth.middleware";
import { isAuthenticated } from "./action";
const adminRoutes = ["/dashboard"];
const isProtectedRoute = ["/dashboard", "/checkout", "/profile", "/order"];
import createIntlMiddleware from "next-intl/middleware";
import { localePrefix, defaultLocale, locales, pathnames } from "./config";
export const intlMiddleware = createIntlMiddleware({
  locales, // Sesuaikan dengan bahasa yang Anda gunakan
  defaultLocale,
  localePrefix,
  pathnames,
});
const publicPages = [""];
export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    // remove lang locale
    // /en/about => /about
    const path = "/" + pathname.split("/").splice(2).join("/");
    if (path.startsWith("/auth")) {
      const isLogin = (await isAuthenticated(req)) as boolean;
      if (isLogin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return intlMiddleware(req);
    }
    // 4. Check if the route requires admin access
    if (isProtectedRoute.some((pathAuth) => path.startsWith(pathAuth))) {
      return authMiddleware(req);
    }
    if (adminRoutes.some((adminPath) => path.startsWith(adminPath))) {
      return adminMiddleware(req);
    }
    return intlMiddleware(req);
  } catch (error) {
    console.error("Error in middleware processing:", error);
    // On error, handle redirects appropriately
    const currentUrl = encodeURIComponent(req.nextUrl.href); // Encode URL to be used in redirection
    const token = req.cookies.get("accessToken")?.value;
    const { pathname } = req.nextUrl;

    if (token) {
      // If the user has a token but there's an error, redirect to the home page
      return NextResponse.redirect(new URL("/", req.url));
    }
    // If no token and trying to access auth, allow access
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    // Default: redirect to login on errors
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${currentUrl}`, req.url)
    );
  }
}

// Apply middleware to specific paths
export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
