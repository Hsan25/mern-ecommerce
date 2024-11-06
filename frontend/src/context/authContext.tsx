"use client";
import {
  useEffect,
  createContext,
  ReactNode,
  useState,
  useContext,
} from "react";
import { User } from "@/types";
import { jwtDecode } from "jwt-decode";
import apiService from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

interface AuthContextType {
  user: User | null;
  isAuthenticate: boolean;
  logout: () => Promise<void | null>;
  login: (
    data: { email: string; password: string },
    redirectUrl?: string
  ) => Promise<void>;
  register: (data: Register) => Promise<void>;
}

interface ConfigAxios extends InternalAxiosRequestConfig {
  headers: AxiosHeaders;
  _retry?: boolean;
}
export interface Register {
  username: string;
  email: string;
  password: string;
  role?: "ADMIN" | "USER";
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { push } = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const logout = async (): Promise<void> => {
    try {
      const res = await apiService.delete("/auth/logout");
      push(res.data.data.redirectUrl);
      toast({
        title: "Notif",
        description: "Logout success!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Notif",
        description: "Error!",
      });
      // throw new Error("Failed logout");
    }
  };
  const login = async (
    data: { email: string; password: string },
    redirectUrl?: string
  ) => {
    try {
      const response = await apiService.post(`/auth/login`, data);
      const result = await response.data;
      setToken(result.token);
      const redirect =
        redirectUrl || decodeURIComponent(searchParams.get("redirect") || "/");
      push(redirect);
    } catch (error: any) {
      console.log(error);
      throw new Error("login failed");
    }
  };

  const register = async (data: Register) => {
    try {
      const res = await apiService.post("/users/register", data);
      const result = await res.data;
      return result;
    } catch (error: any) {
      throw new Error(error.response.data.msg || "Register Failed");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token || !user) {
          const res = await apiService.get("/auth/token");
          setToken(res.data.token);
          const decoded: User = jwtDecode(res.data.token || "");
          const { data } = await apiService.get(`/users/${decoded._id}`);
          setUser(data.data.user as User);
          setIsAuthenticate(true);
          return;
        }
        const decoded: User = jwtDecode(token || "");
        const { data } = await apiService.get(`/users/${decoded._id}`);
        setUser(data.data.user as User);
        setIsAuthenticate(true);
      } catch (error) {
        console.error(error);
        setUser(null);
        setIsAuthenticate(false);
      }
    };
    fetchUser();
    const requestInterceptor = apiService.interceptors.request.use(
      async (config: ConfigAxios) => {
        if (token && !config._retry) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    return () => {
      apiService.interceptors.request.eject(requestInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  useEffect(() => {
    const responseInterceptor = apiService.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config as ConfigAxios;
        if (
          error.response.status == 401 &&
          error.response.message == "Unauthorized" &&
          !originalRequest._retry
        ) {
          try {
            const res = await apiService.get("/auth/token");
            setToken(res.data.token);
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${res.data.token}`;
            originalRequest._retry = true;
            return apiService(originalRequest);
          } catch (error) {
            setToken(null);
            return Promise.reject(error); // Akhiri dengan error
          }
        }

        return Promise.reject(error);
      }
    );
    return () => {
      apiService.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ register, user, isAuthenticate, logout, login }}
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
