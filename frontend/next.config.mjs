/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
import nextPWA from "next-pwa";
const withNextIntl = createNextIntlPlugin();
const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
        port: "3001",
      },
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
    ],
  },
};

export default withNextIntl(withPWA(nextConfig));
