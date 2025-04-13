"use client";
import {
  useEffect,
  createContext,
  ReactNode,
  useState,
  useContext,
  useLayoutEffect,
} from "react";
import { Signup, User } from "@/types";
import apiService, { ConfigAxios } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticate: boolean;
  logout: () => Promise<void | null>;
  login: (
    data: { email: string; password: string },
    redirectUrl?: string
  ) => Promise<void>;
  signup: (data: Signup) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { push } = useRouter();
  const { toast } = useToast();
  // const [token, setToken] = useState<string>("");
  const searchParams = useSearchParams();
  const logout = async (): Promise<void> => {
    try {
      const res = await apiService.delete("/auth/logout");
      push(res.data.data.redirectUrl);
      toast({
        title: "alert",
        description: "Logout success!",
      });
      setUser(null);
      setIsAuthenticate(false);
      localStorage.removeItem("token");
    } catch (error) {
      toast({
        title: "alert",
        description: "Error!",
      });
      throw new Error("Failed logout");
    }
  };
  const login = async (
    data: { email: string; password: string },
    redirectUrl?: string
  ) => {
    try {
      const response = await apiService.post(`/auth/login`, data);
      const result = await response.data;
      // simpan access token di local storage
      // 5m
      setUser(result.user as User);
      setIsAuthenticate(true);
      // setToken(result.token);
      localStorage.setItem("token", result.token); // save access token to localstorage
      const redirect =
        redirectUrl || decodeURIComponent(searchParams.get("redirect") || "/");
      push(redirect);
    } catch (error: any) {
      throw new Error(error.response.data.msg || "login failed");
    }
  };
  const signup = async (data: Signup) => {
    try {
      const res = await apiService.post("/auth/signup", data);
      const result = await res.data;
      return result;
    } catch (error: any) {
      throw new Error(error.response.data.msg || "signup Failed");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiService.get("/auth/me");
        setUser(res.data.data.user as User);
        setIsAuthenticate(true);
      } catch (error) {
        console.error(error);
        setUser(null);
        setIsAuthenticate(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signup, user, isAuthenticate, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContextProvider required");
  }
  return context;
};
export default AuthContextProvider;
