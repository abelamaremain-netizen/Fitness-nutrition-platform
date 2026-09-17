import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LangProvider } from "@/context/LangContext";

const geist    = Geist({ variable: "--font-sans", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const SITE_URL  = "https://fitness-nutrition-platform.vercel.app";
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

  // Verification (add your Search Console ID when you have it)
  // verification: { google: "your-google-verification-code" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <body
        style={{ background: "#0d0d0d", color: "#f0f0f0" }}
        className="min-h-screen flex flex-col antialiased"
      >
        <LangProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
