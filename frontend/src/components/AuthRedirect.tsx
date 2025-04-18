"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticate } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticate) {
      router.replace("/"); // Redirect ke homepage kalau sudah login
    }
  }, [isAuthenticate]);

  if (isAuthenticate) return null;

  return <>{children}</>;
}
