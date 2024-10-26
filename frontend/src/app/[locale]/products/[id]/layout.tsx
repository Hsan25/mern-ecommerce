// import React from "react";
// import ProductDetailPage from "./page";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "detail",
// };

// export default ProductDetailPage;
import type { Metadata } from "next";
import ProductDetailPage from "./page";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({ params, searchParams }: Props): Metadata {
  return {
    title: `detail`,
  };
}

export default function Page({ params, searchParams }: Props) {
  return <ProductDetailPage params={params} />;
}
