import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = {
  title: "Privacy Policy — Naodi & Samri Fitness",
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "When you make a purchase, we collect your name, email address, and phone number (for mobile payment methods). We do not collect payment card details — these are handled directly by our payment processors.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information solely to: process your order and deliver your purchased content, send you a purchase confirmation email, and contact you if there is an issue with your order. We do not use your information for marketing without your explicit consent.",
  },
  {
    title: "3. Health Data",
    body: "If you use our BMI calculator or recommendation tools, the data you enter (age, weight, height, health conditions, allergies) is used only to generate recommendations during your session. This data is not stored on our servers unless you explicitly submit it as part of a purchase.",
  },
  {
    title: "4. Data Sharing",
    body: "We do not sell, rent, or share your personal information with third parties, except as necessary to process payments (Chapa, Telebirr) or comply with legal obligations.",
  },
  {
    title: "5. Data Security",
    body: "We use industry-standard security measures including SSL encryption to protect your data during transmission. Your data is stored securely in our database hosted on Supabase infrastructure.",
  },
  {
    title: "6. Data Retention",
    body: "We retain your order information for accounting and legal compliance purposes. You may request deletion of your personal data at any time by contacting us.",
  },
  {
    title: "7. Cookies",
    body: "We use minimal cookies necessary for site functionality (language preference, session management). We do not use tracking or advertising cookies.",
  },
  {
    title: "8. Your Rights",
    body: "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at hello@naodiansamri.com.",
  },
  {
    title: "9. Changes to This Policy",
    body: "We may update this privacy policy periodically. The date of the most recent update is shown above. Continued use of our platform constitutes acceptance of the updated policy.",
  },
  {
    title: "10. Contact",
    body: "For any privacy-related questions, contact us at hello@naodiansamri.com or via WhatsApp at +251 91 234 5678.",
  },
];

export default function PrivacyPage() {
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

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <AnimatedSection key={s.title}>
              <h2 className="text-white font-bold text-base mb-3">{s.title}</h2>
              <p className="text-white/50 text-sm leading-8">{s.body}</p>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6">
          <Link href="/terms" className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
            Terms &amp; Conditions →
          </Link>
          <Link href="/contact" className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors">
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}
