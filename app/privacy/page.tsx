import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getSiteContent } from "@/src/lib/services/content-public";

export const revalidate = 60;

export const metadata = {
  title: "Privacy Policy — Naodi & Samri Fitness",
};

const DEFAULT_PRIVACY = `1. Information We Collect
When you make a purchase, we collect your name, email address, and phone number (for mobile payment methods). We do not collect payment card details — these are handled directly by our payment processors.

2. How We Use Your Information
We use your information solely to: process your order and deliver your purchased content, send you a purchase confirmation email, and contact you if there is an issue with your order. We do not use your information for marketing without your explicit consent.

3. Health Data
If you use our BMI calculator or recommendation tools, the data you enter (age, weight, height, health conditions, allergies) is used only to generate recommendations during your session. This data is not stored on our servers unless you explicitly submit it as part of a purchase.

4. Data Sharing
We do not sell, rent, or share your personal information with third parties, except as necessary to process payments (Chapa, Telebirr) or comply with legal obligations.

5. Data Security
We use industry-standard security measures including SSL encryption to protect your data during transmission. Your data is stored securely in our database hosted on Supabase infrastructure.

6. Data Retention
We retain your order information for accounting and legal compliance purposes. You may request deletion of your personal data at any time by contacting us.

7. Cookies
We use minimal cookies necessary for site functionality (language preference, session management). We do not use tracking or advertising cookies.

8. Your Rights
You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at hello@naodiansamri.com.

9. Changes to This Policy
We may update this privacy policy periodically. Continued use of our platform constitutes acceptance of the updated policy.

10. Contact
For any privacy-related questions, contact us at hello@naodiansamri.com or via WhatsApp at +251 91 234 5678.`;

export default async function PrivacyPage() {
  const siteContent = await getSiteContent().catch((): Record<string, string> => ({}));
  const content = siteContent.privacy_content || DEFAULT_PRIVACY;
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-8">
        <AnimatedSection className="mb-14">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Legal</p>
          <h1 style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy <em>Policy</em>
          </h1>
          <p className="text-white/35 text-sm">Last updated: September 2026</p>
        </AnimatedSection>

        <div className="space-y-8">
          {paragraphs.map((para: string, i: number) => {
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
          <Link href="/terms"
            className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
            Terms &amp; Conditions →
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
