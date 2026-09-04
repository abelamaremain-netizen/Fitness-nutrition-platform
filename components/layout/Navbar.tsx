"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const [lang,     setLang]     = useState<"EN" | "AM">("EN");
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

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
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className={`text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors ${
                  pathname === l.href ? "text-white" : "text-white/45 hover:text-white/80"
                }`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right — language toggle + mobile hamburger only */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setLang(l => l === "EN" ? "AM" : "EN")}
              className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/35 hover:text-white/70 transition-colors">
              {lang === "EN" ? "አማ" : "EN"}
            </button>

            {/* Browse Plans CTA — replaces Login/Get Started */}
            <Link href="/plans"
              className="hidden md:block btn btn-white text-[10px] py-2.5 px-6">
              Browse Plans
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

              {/* Drawer header */}
              <div className="flex items-center justify-between px-8 h-[72px] border-b border-white/[0.08]">
                <span className="text-white text-sm font-black tracking-wider uppercase"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  Naodi &amp; Samri
                </span>
                <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-6 py-8 flex flex-col gap-6 overflow-y-auto">
                {NAV_LINKS.map((l) => (
                  <Link key={l.href} href={l.href}
                    className={`text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                      pathname === l.href ? "text-white" : "text-white/40 hover:text-white"
                    }`}>
                    {l.label}
                  </Link>
                ))}
              </nav>

              {/* Footer actions */}
              <div className="px-6 pb-8 pt-6 border-t border-white/[0.08] flex flex-col gap-3">
                <button onClick={() => setLang(l => l === "EN" ? "AM" : "EN")}
                  className="text-[10px] font-semibold tracking-widest uppercase text-white/35 text-left">
                  {lang === "EN" ? "Switch to አማርኛ" : "Switch to English"}
                </button>
                <Link href="/plans" onClick={() => setOpen(false)}
                  className="btn btn-white py-3 text-[10px] text-center">
                  Browse Plans
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
