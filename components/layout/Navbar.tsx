"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLang } from "@/context/LangContext";
import type { TranslationKey } from "@/lib/i18n";

// Nav links: href is fixed (never translated), label key is looked up
const NAV_ITEMS: { href: string; key: TranslationKey }[] = [
  { href: "/",              key: "nav.home" },
  { href: "/plans",         key: "nav.plans" },
  { href: "/fitness-plan",  key: "nav.fitnessPlan" },
  { href: "/meal-plan",     key: "nav.mealPlan" },
  { href: "/bmi",           key: "nav.bmi" },
  { href: "/how-it-works",  key: "nav.howItWorks" },
  { href: "/blog",          key: "nav.blog" },
  { href: "/about",         key: "nav.about" },
  { href: "/contact",       key: "nav.contact" },
];

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const toggleLang = () => setLang(lang === "en" ? "am" : "en");

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/[0.08]"
          : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between gap-6"
          style={{ height: "72px" }}>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-start leading-none flex-shrink-0">
            <span className="text-white text-base font-black tracking-wider uppercase"
              style={{ fontFamily: "var(--font-serif)" }}>
              Naodi <span className="text-white/50">&</span> Samri
            </span>
            <span className="text-white/40 text-[8px] font-semibold tracking-[0.3em] uppercase -mt-0.5">
              FITNESS
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map(({ href, key }) => (
              <Link key={href} href={href}
                className={`text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors whitespace-nowrap ${
                  pathname === href ? "text-white" : "text-white/45 hover:text-white/80"
                }`}>
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Language toggle — switches between EN and አማ */}
            <button onClick={toggleLang}
              className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors border border-white/15 hover:border-white/35 px-2.5 py-1 rounded-lg">
              {lang === "en" ? "አማ" : "EN"}
            </button>

            <Link href="/plans" className="hidden md:block btn btn-white text-[10px] py-2.5 px-6">
              {t("nav.browsePlans")}
            </Link>

            <button onClick={() => setOpen(!open)}
              className="lg:hidden text-white/60 hover:text-white transition-colors">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#111] border-l border-white/[0.08] flex flex-col lg:hidden">

              <div className="flex items-center justify-between px-8 h-[72px] border-b border-white/[0.08]">
                <span className="text-white text-sm font-black tracking-wider uppercase"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  Naodi &amp; Samri
                </span>
                <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 px-6 py-8 flex flex-col gap-5 overflow-y-auto">
                {NAV_ITEMS.map(({ href, key }) => (
                  <Link key={href} href={href}
                    className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                      pathname === href ? "text-white" : "text-white/40 hover:text-white"
                    }`}>
                    {t(key)}
                  </Link>
                ))}
              </nav>

              <div className="px-6 pb-8 pt-6 border-t border-white/[0.08] flex flex-col gap-3">
                <button onClick={toggleLang}
                  className="text-[11px] font-semibold tracking-widest uppercase text-white/35 text-left">
                  {lang === "en" ? "🇪🇹 አማርኛ ቀይር" : "🇬🇧 Switch to English"}
                </button>
                <Link href="/plans" onClick={() => setOpen(false)}
                  className="btn btn-white py-3 text-[10px] text-center">
                  {t("nav.browsePlans")}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
