import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";

export const getToken = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_API}/auth/token`,
      {
        withCredentials: true,
      }
    );
    const data = res.data;
    console.log("from get token", data);
    return data.token as string;
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = async (req: NextRequest): Promise<boolean> => {
  try {
    const token = await getToken();
    if (!token) {
      return false;
    }
    return true;
  } catch (error: any) {
    console.error("Middleware Auth Error:", error?.response?.data || error);
    return false;
  }
};
