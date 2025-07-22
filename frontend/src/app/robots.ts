import { MetadataRoute } from "next/";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "*",
      disallow: ["/id/auth/*", "/en/auth/*", "/id/orders/*", "/en/orders/*"],
      
    },
    sitemap:`${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
  };
}
