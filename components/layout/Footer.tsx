import Link from "next/link";

const cols = {
  Plans: [
    { label: "All Plans", href: "/plans" },
    { label: "Fitness Plans", href: "/fitness-plan" },
    { label: "Meal Plans", href: "/meal-plan" },
    { label: "BMI Calculator", href: "/bmi" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Blog", href: "/blog" },
    { label: "Testimonials", href: "/testimonials" },
  ],
  Support: [
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="max-w-5xl mx-auto px-8 pt-20 pb-10">

        {/* Top: brand + links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-10 mb-16">
          {/* Brand — 2 cols */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-white text-lg font-black tracking-wider uppercase block"
                style={{ fontFamily: "var(--font-serif)" }}>Naodi <span className="text-white/50">&</span> Samri</span>
              <span className="text-white/30 text-[8px] font-semibold tracking-[0.32em] uppercase mt-0.5 block">FITNESS</span>
            </Link>
            <p className="text-white/40 text-sm leading-7 max-w-[220px] mb-8">
              Science-backed fitness &amp; nutrition plans. Built for Ethiopia, built for results.
            </p>
            <div className="flex gap-3">
              {["IG", "YT", "TK"].map((s) => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-lg border border-white/15 hover:border-white/45 flex items-center justify-center text-[10px] font-bold text-white/35 hover:text-white transition-all tracking-wider">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols — 3 cols */}
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <p className="text-[9px] font-bold tracking-[0.26em] uppercase text-white/35 mb-6">
                {title}
              </p>
              <ul className="space-y-4">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm leading-relaxed text-white/40 hover:text-white/80 transition-colors">
                      {l.label}
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
            © 2026 Naodi & Samri Fitness. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[11px] text-white/20 tracking-widest uppercase">Made in Ethiopia</p>
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
