// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "USER" | "ADMIN"; // optional role yang dibutuhkan
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticate, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Belum login
    if (!isAuthenticate) {
      router.push(
        `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    // Sudah login tapi tidak punya role yang sesuai
    if (role && user?.role !== role) {
      router.push("/"); // bikin halaman unauthorized atau redirect ke beranda
    }
  }, [isAuthenticate, user]);

  if (!isAuthenticate || (role && user?.role !== role)) {
    return <Loading />; // tampilkan loading / spinner juga bisa
  }

  return <>{children}</>;
};
