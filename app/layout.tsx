import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LangProvider } from "@/context/LangContext";
import { createServerClient } from "@/src/lib/supabase/server";

const geist    = Geist({ variable: "--font-sans", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const SITE_URL  = "https://naodi-samri-fitness.vercel.app";
const SITE_NAME = "Naodi & Samri Fitness";
const OG_IMAGE  = `${SITE_URL}/og-default.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Transform Your Body`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Science-backed fitness and nutrition plans by Naodi & Samri. Personalised programs for weight loss, muscle gain, and healthy living — built for Ethiopia.",

  keywords: [
    "fitness plans Ethiopia",
    "nutrition plans Addis Ababa",
    "weight loss plan Ethiopia",
    "muscle gain program",
    "Ethiopian diet plan",
    "Naodi Samri fitness",
    "BMI calculator Ethiopia",
    "meal plan Ethiopia",
    "personal trainer Ethiopia",
    "health and wellness Ethiopia",
  ],

  authors: [{ name: "Naodi & Samri Fitness" }],
  creator: "Naodi & Samri Fitness",
  publisher: "Naodi & Samri Fitness",

  // Canonical + alternate
  alternates: {
    canonical: "/",
  },

  // Open Graph
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         SITE_URL,
    siteName:    SITE_NAME,
    title:       `${SITE_NAME} — Transform Your Body`,
    description: "Science-backed fitness and nutrition plans by Naodi & Samri. Personalised programs for weight loss, muscle gain, and healthy living — built for Ethiopia.",
    images: [
      {
        url:    OG_IMAGE,
        width:  1200,
        height: 630,
        alt:    "Naodi & Samri Fitness",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card:        "summary_large_image",
    title:       `${SITE_NAME} — Transform Your Body`,
    description: "Science-backed fitness and nutrition plans by Naodi & Samri.",
    images:      [OG_IMAGE],
  },

  // Indexing
  robots: {
    index:                  true,
    follow:                 true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  // Icons
  icons: {
    icon:  "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Verification
  verification: { google: "JDUCcuym368lHfM2DwLcuRIq7L43YDP5pSr39Haae1g" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const isAdmin = headersList.get("x-is-admin") === "1";

  // Fetch social links for footer (skip on admin pages)
  let instagram: string | undefined;
  let youtube:   string | undefined;
  let tiktok:    string | undefined;
  if (!isAdmin) {
    try {
      const supabase = await createServerClient();
      const { data } = await supabase
        .from("site_content")
        .select("key, value")
        .in("key", ["social_instagram", "social_youtube", "social_tiktok"]);
      for (const row of data ?? []) {
        if (row.key === "social_instagram" && row.value) instagram = row.value;
        if (row.key === "social_youtube"   && row.value) youtube   = row.value;
        if (row.key === "social_tiktok"    && row.value) tiktok    = row.value;
      }
    } catch { /* social links are optional */ }
  }

  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <body
        style={{ background: "#0d0d0d", color: "#f0f0f0" }}
        className="min-h-screen flex flex-col antialiased"
      >
        <LangProvider>
          {!isAdmin && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isAdmin && <Footer instagram={instagram} youtube={youtube} tiktok={tiktok} />}
        </LangProvider>
      </body>
    </html>
  );
}
