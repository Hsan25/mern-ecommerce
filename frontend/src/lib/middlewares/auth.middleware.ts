import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/action";
import { intlMiddleware } from "@/middleware";
export async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const path = "/" + pathname.split("/").splice(2).join("/");
  const currentUrl = encodeURIComponent(req.nextUrl.href); // Encode URL to be used in redirection
  // const isLogin = await isAuthenticated(req);
  const previosUrl = req.headers.get("referer");
  // if (!isLogin) {
  //   return NextResponse.redirect(
  //     new URL(`/auth/login?redirect=${currentUrl}`, req.url)
  //   );
  // }

  return intlMiddleware(req);
}
