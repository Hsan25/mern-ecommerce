import apiService from "@/lib/axios";
import { PayloadJWT } from "@/types";
import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";
export const isAuthenticated = async (req: NextRequest) => {
  let token = req.cookies.get("accessToken")?.value || "";
  try {
    if (!token) {
      return false;
    }
    const decoded = jwtDecode<PayloadJWT & { exp: number }>(token);
    const now = Date.now();
    const exp = decoded.exp * 1000;
    if (now > exp) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
