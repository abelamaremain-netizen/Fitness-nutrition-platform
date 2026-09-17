import type { MetadataRoute } from "next";

const SITE_URL = "https://fitness-nutrition-platform.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",        // entire admin panel
          "/api/",          // all API routes
          "/my-order",      // personal order page — no value to index
          "/checkout/",     // checkout pages
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host:    SITE_URL,
  };
}
