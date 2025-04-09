import type { Metadata } from "next";
import React from "react";

export function generateMetadata(): Metadata {
  return {
    title: `detail`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
