import Link from "next/link";

interface Props {
  instagram?: string;
  youtube?:   string;
  tiktok?:    string;
}

export default function Footer({ instagram, youtube, tiktok }: Props) {
  const cols = [
    {
      title: "Plans",
      links: [
        { label: "All Plans",       href: "/plans" },
        { label: "Fitness Plans",   href: "/fitness-plan" },
        { label: "Meal Plans",      href: "/meal-plan" },
        { label: "BMI Calculator",  href: "/bmi" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us",        href: "/about" },
        { label: "How It Works",    href: "/how-it-works" },
        { label: "Blog",            href: "/blog" },
        { label: "Testimonials",    href: "/testimonials" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact",         href: "/contact" },
        { label: "FAQ",             href: "/faq" },
        { label: "My Order",        href: "/my-order" },
        { label: "Terms",           href: "/terms" },
        { label: "Privacy",         href: "/privacy" },
      ],
    },
  ];

  // Only show social links that have a real URL set in admin
  const socials = [
    { label: "Instagram", abbr: "IG", href: instagram },
    { label: "YouTube",   abbr: "YT", href: youtube },
    { label: "TikTok",    abbr: "TK", href: tiktok },
  ].filter((s) => s.href);

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
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map(({ abbr, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg border border-white/15 hover:border-white/45 flex items-center justify-center text-[10px] font-bold text-white/35 hover:text-white transition-all tracking-wider">
                    {abbr}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-[9px] font-bold tracking-[0.26em] uppercase text-white/35 mb-6">
                {col.title}
              </p>
              <ul className="space-y-4">
                {col.links.map((l) => (
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
            © {new Date().getFullYear()} Naodi &amp; Samri Fitness. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[11px] text-white/20 tracking-widest uppercase">
              Made in Ethiopia 🇪🇹
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
