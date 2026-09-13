import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube thumbnails
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      // Supabase Storage — plan images, thumbnails, PDFs uploaded via admin panel
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Allow any https image — covers external URLs admins paste in
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
