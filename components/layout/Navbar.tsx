"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLang } from "@/context/LangContext";
import type { TranslationKey } from "@/lib/i18n";

// All nav items — shown in mobile drawer
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
  { href: "/my-order",      key: "nav.myOrder" },
];

// Desktop nav — only the most important pages to avoid overflow
const DESKTOP_NAV: { href: string; key: TranslationKey }[] = [
  { href: "/plans",         key: "nav.plans" },
  { href: "/fitness-plan",  key: "nav.fitnessPlan" },
  { href: "/meal-plan",     key: "nav.mealPlan" },
  { href: "/bmi",           key: "nav.bmi" },
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
          <nav className="hidden lg:flex items-center gap-5">
            {DESKTOP_NAV.map(({ href, key }) => (
              <Link key={href} href={href}
                className={`text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors whitespace-nowrap ${
                  pathname === href ? "text-white" : "text-white/45 hover:text-white/80"
                }`}>
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* My Order — quick access */}
            <Link href="/my-order"
              className={`hidden lg:block text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors whitespace-nowrap ${
                pathname === "/my-order" ? "text-white" : "text-white/45 hover:text-white/80"
              }`}>
              {t("nav.myOrder")}
            </Link>

            {/* Language toggle */}
            <button onClick={toggleLang}
              className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors border border-white/15 hover:border-white/35 px-2.5 py-1 rounded-lg">
              {lang === "en" ? "አማ" : "EN"}
            </button>

            <Link href="/plans" className="hidden lg:block btn btn-white text-[10px] py-2.5 px-5">
              {t("nav.browsePlans")}
            </Link>

            <button onClick={() => setOpen(!open)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
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
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-80 bg-[#0f0f0f] border-l border-white/[0.08] flex flex-col">

              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/[0.08] flex-shrink-0">
                <span className="text-white text-sm font-black tracking-wider uppercase"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  Naodi &amp; Samri
                </span>
                <button onClick={() => setOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Nav links — scrollable if needed */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {NAV_ITEMS.map(({ href, key }) => (
                  <Link key={href} href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all mb-1 ${
                      pathname === href
                        ? "bg-white text-black"
                        : "text-white/55 hover:text-white hover:bg-white/[0.06]"
                    }`}>
                    {t(key)}
                  </Link>
                ))}
              </nav>

              {/* Footer actions */}
              <div className="px-4 pb-6 pt-4 border-t border-white/[0.08] flex-shrink-0 space-y-3">
                <button onClick={() => { toggleLang(); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
                  <span className="font-semibold tracking-wide">
                    {lang === "en" ? "አማርኛ" : "English"}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-white/25">
                    {lang === "en" ? "Switch language" : "ቋንቋ ቀይር"}
                  </span>
                </button>
                <Link href="/plans" onClick={() => setOpen(false)}
                  className="btn btn-white w-full py-3.5 text-center text-[11px]">
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
