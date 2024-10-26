"use client";
import { defaultLocale } from "@/config";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect(`/${defaultLocale}`)
}