import { ReactNode } from "react";
import { roboto_mono } from "./fonts";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} className="dark">
      <head>
        <meta
          name="google-site-verification"
          content="8I3iaMVvlmK5CPwq2UUbPt6uN5_I896AOVwhT2eXSbU"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={roboto_mono.className}>{children}</body>
    </html>
  );
}
