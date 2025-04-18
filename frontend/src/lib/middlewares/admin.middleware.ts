import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { intlMiddleware } from "@/middleware";
import axios from "axios";
import { getToken } from "@/action";
export async function adminMiddleware(req: NextRequest) {
  const token = await getToken();
  try {
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
    return NextResponse.redirect(new URL("/", req.url));
  }
}
