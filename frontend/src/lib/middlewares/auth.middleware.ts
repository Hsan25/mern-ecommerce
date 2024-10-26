import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/action";
import { intlMiddleware } from "@/middleware";
import apiService from "../axios";
import { jwtDecode } from "jwt-decode";
import { PayloadJWT } from "@/types";
export async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const path = "/" + pathname.split("/").splice(2).join("/");
  const currentUrl = encodeURIComponent(req.nextUrl.href); // Encode URL to be used in redirection
  const token = req.cookies.get("accessToken")?.value || "";
  const isLogin = await isAuthenticated(req);
  const previosUrl = req.headers.get("referer");
  if (!isLogin) {
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${currentUrl}`, req.url)
    );
  }
  if (path.startsWith("/checkout")) {
    try {
      const cartId = req.nextUrl.pathname.split("/").pop();
      const decoded = jwtDecode<PayloadJWT>(token);
      const res = await apiService.get(`/carts/${cartId}/${decoded._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data.data;
      //check items cart
      // if items 0 redirect 
      if (data.cart.items.length < 1)
        return NextResponse.redirect(new URL(previosUrl || "/", req.url));
      return intlMiddleware(req);
    } catch (error) {
      return NextResponse.redirect(new URL(previosUrl || "/", req.url));
    }
  }
  return intlMiddleware(req);
}
