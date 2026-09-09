import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Terms & Conditions — Naodi & Samri Fitness",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.",
  },
  {
    title: "2. Digital Products",
    body: "All plans sold on this platform are digital products delivered as PDF guides and video links. Due to the digital nature of these products, all sales are final and non-refundable once the PDF has been downloaded or video content has been accessed.",
  },
  {
    title: "3. Payments",
    body: "Payments are processed securely through Chapa (Telebirr, CBE Birr, other Ethiopian banks) and international card processors. We do not store your payment details.",
  },
  {
    title: "4. Content Access",
    body: "Upon successful payment, you will receive access to the purchased plan content including PDF downloads and video links. This access is for your personal, non-commercial use only. You may not share, redistribute, or resell plan content.",
  },
  {
    title: "5. Health Disclaimer",
    body: "The fitness and nutrition plans on this platform are for general informational purposes only and do not constitute medical advice. Always consult a qualified healthcare provider before starting any new fitness or diet programme, especially if you have pre-existing health conditions.",
  },
  {
    title: "6. Intellectual Property",
    body: "All content on this platform — including plans, guides, videos, images, and text — is the property of Naodi & Samri Fitness. Unauthorised reproduction, distribution, or use of any content is strictly prohibited.",
  },
  {
    title: "7. Limitation of Liability",
    body: "Naodi & Samri Fitness shall not be liable for any direct, indirect, incidental, or consequential damages resulting from use of our plans or platform. Results may vary and are not guaranteed.",
  },
  {
    title: "8. Changes to Terms",
    body: "We reserve the right to update these terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the updated terms.",
  },
  {
    title: "9. Contact",
    body: "For any questions regarding these terms, please contact us at hello@naodiansamri.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-8">
        <AnimatedSection className="mb-14">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Legal</p>
          <h1 style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms &amp; <em>Conditions</em>
          </h1>
          <p className="text-white/35 text-sm">Last updated: September 2026</p>
        </AnimatedSection>

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <AnimatedSection key={s.title}>
              <h2 className="text-white font-bold text-base mb-3">{s.title}</h2>
              <p className="text-white/50 text-sm leading-8">{s.body}</p>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6">
          <Link href="/privacy" className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/contact" className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}
