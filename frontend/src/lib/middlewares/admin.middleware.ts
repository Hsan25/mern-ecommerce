import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { intlMiddleware } from "@/middleware";
import axios from "axios";
export async function adminMiddleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value || "";
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const currentUrl = encodeURIComponent(req.nextUrl.href); // Encode URL to be used in redirection
  try {
    // 4. Check if the route requires admin access
    const decoded = jwtDecode(token) as { _id: string };
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_API}/users/${decoded._id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = res.data.data.user;
    if (data.role == "ADMIN") {
      return intlMiddleware(req);
    }
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    if (refreshToken) {
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
}
