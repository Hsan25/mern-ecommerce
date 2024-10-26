import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/action";
import { jwtDecode } from "jwt-decode";
import { intlMiddleware } from "@/middleware";
import { PayloadJWT } from "@/types";
import apiService from "../axios";
const onlyAdminRoutes = ["/dashboard"];
export async function adminMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const previosUrl = req.headers.get("referer");
  const token = req.cookies.get("accessToken")?.value;
  const currentUrl = encodeURIComponent(req.nextUrl.href); // Encode URL to be used in redirection
  // const isLogin = await isAuthenticated(req);
  if (!token) {
    // Redirect to login if token is invalid
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${currentUrl}`, req.url)
    );
  }
  try {
    // 4. Check if the route requires admin access
    const decoded = jwtDecode<PayloadJWT>(token);
    // const res = await apiService.get(`/users/${decoded._id}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    // const user = res.data.data.user;
    // console.log("from middleware", user);
    if (decoded.role == "ADMIN") {
      return intlMiddleware(req);
    }
    return NextResponse.redirect(new URL(previosUrl || "/", req.url));
  } catch (error) {
    return NextResponse.redirect(new URL(previosUrl || "/", req.url));
  }
}
