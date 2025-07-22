import "../globals.css";
import { roboto_mono } from "../fonts";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import AuthContextProvider from "@/context/authContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SWRProvider from "@/components/swr-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import OrderContextProvider from "@/context/orderContext";

export const metadata: Metadata = {
  title: "Galaxy Store - Jual Produk Keren",
  description: "Temukan produk pilihan berkualitas di Galaxy Store.",
  keywords: "galaxy, store, ecommerce, produk, online shop,belanja online",
  robots: "index, follow",
  manifest: "/manifest.json",
  openGraph: {
    title: "Galaxy Store",
    description: "Temukan produk pilihan berkualitas di Galaxy Store.",
    url: "https://galaxy-store-x.vercel.app",
    siteName: "Galaxy Store",
    images: [
      {
        url: "/galaxy.jpg", // gambar untuk sosial media
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  return (
    // <html lang={params.locale} className="dark">
    //   <body className={roboto_mono.className}>
    <NextIntlClientProvider messages={messages}>
      <AuthContextProvider>
        <OrderContextProvider>
          <SWRProvider>
            <Navbar />
            <main className="container pt-8 md:px-10 lg:px-28">{children}</main>
            <Toaster />
            <Footer />
          </SWRProvider>
        </OrderContextProvider>
      </AuthContextProvider>
    </NextIntlClientProvider>
    //   </body>
    // </html>
  );
}
