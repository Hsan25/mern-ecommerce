import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";

export const isAuthenticated = async (req: NextRequest): Promise<boolean> => {
  try {
    const token =
      req.cookies.get("accessToken")?.value ||
      req.cookies.get("refreshToken")?.value;

    console.log(token);
    if (!token) return false;
    const decoded = jwtDecode(token) as { _id: string };
    console.log(decoded);
    if (!decoded._id) return false;
    // if (!refreshToken) return false;
    // const res = await axios.get(
    //   `${process.env.NEXT_PUBLIC_SERVER_API}/auth/token`,
    //   {
    //     withCredentials: true,
    //     headers:{
    //       Cookie:`refreshToken=${refreshToken}`
    //     }
    //   }
    // );

    // Jika sukses, berarti user berhasil di-autentikasi
    // return res.status === 200;
    return true;
  } catch (error: any) {
    console.error("Middleware Auth Error:", error?.response?.data || error);
    return false;
  }
};
