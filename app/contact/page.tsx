import { getSiteContent } from "@/src/lib/services/content-public";
import { IMAGES } from "@/lib/data";
import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Naodi & Samri Fitness. Reach us by email, phone, WhatsApp, or via the contact form. We respond within 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title:       "Contact Naodi & Samri Fitness",
    description: "Have a question about a plan or your order? We're here to help.",
    url:         "/contact",
  },
};

export const revalidate = 0;

export default async function ContactPage() {
  const content = await getSiteContent().catch(() => ({} as Record<string, string>));
  const heroImg = content.contact_hero_image || IMAGES.hero4;
  return <ContactClient content={content} heroImg={heroImg} />;
}
