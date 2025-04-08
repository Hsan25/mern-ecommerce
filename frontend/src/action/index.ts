import axios from "axios";
import { NextRequest } from "next/server";

export const isAuthenticated = async (req: NextRequest): Promise<boolean> => {
  try {
    const token = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (token) return true;
    if (!refreshToken) return false;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_API}/auth/token`,
      {
        withCredentials: true,
        headers:{
          Cookie:`refreshToken=${refreshToken}`
        }
      }
    );


    // Jika sukses, berarti user berhasil di-autentikasi
    return res.status === 200;
  } catch (error: any) {
    console.error("Middleware Auth Error:", error?.response?.data || error);
    return false;
  }
};
