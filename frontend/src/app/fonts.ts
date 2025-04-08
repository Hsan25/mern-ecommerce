import { Roboto, Roboto_Mono } from "next/font/google";

export const roboto_mono = Roboto_Mono({
  weight: ["100", "200", "300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
export const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
