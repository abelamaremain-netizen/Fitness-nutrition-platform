import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FaqAccordion from "./FaqAccordion";
import { getFaqs, getSiteContent } from "@/src/lib/services/content-public";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Naodi & Samri Fitness — plans, payments, access, refunds, Amharic support, equipment requirements, and more.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title:       "Frequently Asked Questions | Naodi & Samri Fitness",
    description: "Everything you need to know before buying a plan.",
    url:         "/faq",
  },
};

export const revalidate = 0;

export default async function FaqPage() {
  const [dbFaqs, content] = await Promise.all([
    getFaqs().catch(() => []),
    getSiteContent().catch(() => ({} as Record<string, string>)),
  ]);
  const faqs     = dbFaqs.map((f) => ({ id: f.id, q: f.question, a: f.answer }));
  const whatsapp = content.contact_whatsapp || content.whatsapp_number || "";

  return (
    <div className="min-h-screen">
      <div className="pt-36 pb-16 text-center px-8">
        <AnimatedSection>
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Help</p>
          <h1 style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked <em>Questions</em>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
            Everything you need to know about plans, payments, and access.
          </p>
        </AnimatedSection>
      </div>

      <div className="max-w-3xl mx-auto px-8 pb-24">
        {faqs.length === 0 ? (
          <p className="text-white/30 text-center text-sm py-12">
            No FAQs yet — check back soon or contact us directly.
          </p>
        ) : (
          <FaqAccordion faqs={faqs} />
        )}

        <AnimatedSection className="mt-16">
          <div className="card p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto mb-5">
              <MessageCircle size={20} className="text-white/50" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              Still have questions?
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-7 max-w-xs mx-auto">
              Our team responds via email, phone, and WhatsApp within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="btn btn-white py-3 px-8">
                Contact Us <ArrowRight size={13} />
              </Link>
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline py-3 px-8">
                  WhatsApp Us
                </a>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
