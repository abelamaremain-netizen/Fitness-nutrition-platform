"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "አማ">("EN");
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-400 transition-colors">
              <Zap size={18} className="text-black" fill="black" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              FBA<span className="text-green-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-green-400 bg-green-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "EN" ? "አማ" : "EN")}
              className="hidden md:flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
            >
              {lang === "EN" ? "🇺🇸 EN" : "🇪🇹 አማ"}
            </button>

            <Link
              href="/login"
              className="hidden md:block text-sm text-zinc-400 hover:text-white transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="hidden md:block bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col pt-20 px-6 pb-8 lg:hidden"
          >
            <nav className="flex flex-col gap-1 flex-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block text-lg font-semibold py-3 border-b border-white/5 transition-colors ${
                      pathname === link.href ? "text-green-400" : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => setLang(lang === "EN" ? "አማ" : "EN")}
                className="flex items-center justify-center gap-2 text-sm font-bold text-zinc-400 bg-white/5 border border-white/10 px-4 py-3 rounded-xl"
              >
                {lang === "EN" ? "🇺🇸 Switch to Amharic" : "🇪🇹 Switch to English"}
              </button>
              <Link href="/login" className="text-center text-white font-semibold bg-white/10 py-3 rounded-xl">
                Login
              </Link>
              <Link href="/register" className="text-center text-black font-bold bg-green-500 py-3 rounded-xl">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
