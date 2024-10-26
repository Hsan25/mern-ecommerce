import { checkToken } from "@/action";
import { NextRequest, NextResponse } from "next/server";

export const isAuthenticated = async (req: NextRequest) => {
  const token = req.cookies.get("auth-token")?.value || "";
  if (!token) return false;
  const isValid = await checkToken(token);
  if (!isValid) return false;
  return true;
};
