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
      <body className={roboto_mono.className}>{children}</body>
    </html>
  );
}
