import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getSiteContent } from "@/src/lib/services/content-public";

export const revalidate = 0; // always fetch fresh from DB

export const metadata = {
  title: "Terms & Conditions — Naodi & Samri Fitness",
};

// Default content shown if admin hasn't set it yet
const DEFAULT_TERMS = `1. Acceptance of Terms
By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.

2. Digital Products
All plans sold on this platform are digital products delivered as PDF guides and video links. Due to the digital nature of these products, all sales are final and non-refundable once the PDF has been downloaded or video content has been accessed.

3. Payments
Payments are processed securely through Chapa (Telebirr, CBE Birr, other Ethiopian banks) and international card processors. We do not store your payment details.

4. Content Access
Upon successful payment, you will receive access to the purchased plan content including PDF downloads and video links. This access is for your personal, non-commercial use only. You may not share, redistribute, or resell plan content.

5. Health Disclaimer
The fitness and nutrition plans on this platform are for general informational purposes only and do not constitute medical advice. Always consult a qualified healthcare provider before starting any new fitness or diet programme, especially if you have pre-existing health conditions.

6. Intellectual Property
All content on this platform — including plans, guides, videos, images, and text — is the property of Naodi & Samri Fitness. Unauthorised reproduction, distribution, or use of any content is strictly prohibited.

7. Limitation of Liability
Naodi & Samri Fitness shall not be liable for any direct, indirect, incidental, or consequential damages resulting from use of our plans or platform. Results may vary and are not guaranteed.

8. Changes to Terms
We reserve the right to update these terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the updated terms.

9. Contact
For any questions regarding these terms, please contact us at hello@naodiansamri.com.`;

export default async function TermsPage() {
  const siteContent = await getSiteContent().catch((): Record<string, string> => ({}));
  const content = siteContent.terms_content || DEFAULT_TERMS;

  // Split by double newlines into paragraphs, or by numbered sections
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

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

        <div className="space-y-8">
          {paragraphs.map((para: string, i: number) => {
            // Check if paragraph starts with a number (section heading)
            const isHeading = /^\d+\./.test(para.trim());
            if (isHeading) {
              const [heading, ...rest] = para.split("\n");
              return (
                <AnimatedSection key={i} delay={i * 0.03}>
                  <h2 className="text-white font-bold text-base mb-2">{heading}</h2>
                  {rest.length > 0 && (
                    <p className="text-white/50 text-sm leading-8">{rest.join(" ")}</p>
                  )}
                </AnimatedSection>
              );
            }
            return (
              <AnimatedSection key={i} delay={i * 0.03}>
                <p className="text-white/50 text-sm leading-8">{para}</p>
              </AnimatedSection>
            );
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6">
          <Link href="/privacy"
            className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/contact"
            className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}
