"use client";
import Link from "next/link";
import { useLang } from "@/context/LangContext";

export default function Footer() {
  const { t } = useLang();

  const cols = [
    {
      titleKey: "footer.plans" as const,
      links: [
        { key: "footer.allPlans"     as const, href: "/plans" },
        { key: "footer.fitnessPlans" as const, href: "/fitness-plan" },
        { key: "footer.mealPlans"    as const, href: "/meal-plan" },
        { key: "footer.bmiCalc"      as const, href: "/bmi" },
      ],
    },
    {
      titleKey: "footer.company" as const,
      links: [
        { key: "footer.aboutUs"      as const, href: "/about" },
        { key: "footer.howItWorks"   as const, href: "/how-it-works" },
        { key: "footer.blog"         as const, href: "/blog" },
        { key: "footer.testimonials" as const, href: "/testimonials" },
      ],
    },
    {
      titleKey: "footer.support" as const,
      links: [
        { key: "footer.contact"      as const, href: "/contact" },
        { key: "footer.faq"          as const, href: "/faq" },
        { key: "footer.terms"        as const, href: "/terms" },
        { key: "footer.privacy"      as const, href: "/privacy" },
      ],
    },
  ];

  const socials = [
    { label: "Instagram", abbr: "IG", href: "#" },
    { label: "YouTube",   abbr: "YT", href: "#" },
    { label: "TikTok",    abbr: "TK", href: "#" },
  ];

  return (
    <footer style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="max-w-5xl mx-auto px-8 pt-20 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-white text-lg font-black tracking-wider uppercase block"
                style={{ fontFamily: "var(--font-serif)" }}>
                Naodi <span className="text-white/50">&</span> Samri
              </span>
              <span className="text-white/30 text-[8px] font-semibold tracking-[0.32em] uppercase mt-0.5 block">
                FITNESS
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-7 max-w-[220px] mb-8">
              Science-backed fitness &amp; nutrition plans. Built for Ethiopia, built for results.
            </p>
            <div className="flex gap-3">
              {socials.map(({ abbr, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-lg border border-white/15 hover:border-white/45 flex items-center justify-center text-[10px] font-bold text-white/35 hover:text-white transition-all tracking-wider">
                  {abbr}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.titleKey}>
              <p className="text-[9px] font-bold tracking-[0.26em] uppercase text-white/35 mb-6">
                {t(col.titleKey)}
              </p>
              <ul className="space-y-4">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm leading-relaxed text-white/40 hover:text-white/80 transition-colors">
                      {t(l.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20 tracking-widest uppercase">
            © 2026 Naodi &amp; Samri Fitness. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[11px] text-white/20 tracking-widest uppercase">
              {t("footer.madeIn")}
            </p>
            <Link href="/admin/login"
              className="text-[10px] text-white/15 hover:text-white/40 tracking-widest uppercase transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
