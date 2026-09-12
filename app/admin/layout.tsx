"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  FileText, Menu, X, Bell, ChevronRight,
  Home, LogOut,
} from "lucide-react";
import { createBrowserClient } from "@/src/lib/supabase/client";

const NAV = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/plans",     label: "Plans",      icon: Package },
  { href: "/admin/orders",    label: "Orders",     icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers",  icon: Users },
  { href: "/admin/content",   label: "Content",    icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();

  // Client-side auth guard — backup to middleware
  // Middleware is the real lock; this prevents a flash of admin UI if cookies expire mid-session
  useEffect(() => {
    if (pathname === "/admin/login") return;
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/admin/login");
      }
    });
  }, [pathname, router]);

  const handleLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  // Don't render admin chrome on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const currentPage = NAV.find((n) => isActive(n.href))?.label ?? "Admin";

  /* ── Sidebar nav links (reused in desktop + mobile) ── */
  const NavLinks = () => (
    <>
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive(href)
              ? "bg-white text-black"
              : "text-white/50 hover:text-white hover:bg-white/[0.06]"
          }`}>
          <Icon size={16} strokeWidth={1.8} />
          {label}
          {isActive(href) && <ChevronRight size={12} className="ml-auto" />}
        </Link>
      ))}
    </>
  );

  return (
    /*
     * This wrapper sits above the public <Navbar> (which is fixed z-50).
     * We use z-[60] on the admin chrome so it's always on top.
     * The public Navbar is rendered by app/layout.tsx but on admin pages
     * the admin header covers it completely.
     */
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>

      {/* ── DESKTOP SIDEBAR (fixed, full-height) ── */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-56 z-[60] border-r border-white/[0.07]"
        style={{ background: "#0f0f0f" }}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/[0.07] flex-shrink-0">
          <Link href="/" className="block">
            <span className="text-white text-sm font-black tracking-wider uppercase"
              style={{ fontFamily: "var(--font-serif)" }}>
              Naodi <span className="text-white/40">&</span> Samri
            </span>
            <span className="block text-white/25 text-[9px] font-semibold tracking-[0.28em] uppercase mt-0.5">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <NavLinks />
        </nav>

        {/* Bottom: back to site + logout */}
        <div className="px-3 py-4 border-t border-white/[0.07] space-y-0.5">
          <Link href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/35 hover:text-white hover:bg-white/[0.06] transition-all">
            <Home size={15} strokeWidth={1.8} />
            Back to Site
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/35 hover:text-red-400 hover:bg-red-500/[0.08] transition-all">
            <LogOut size={15} strokeWidth={1.8} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR (fixed, full-width, covers public Navbar) ── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-[60] h-14 flex items-center justify-between px-4 border-b border-white/[0.07]"
        style={{ background: "#0f0f0f" }}>
        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.09] text-white/50 hover:text-white hover:border-white/[0.2] transition-all"
          aria-label="Open menu">
          <Menu size={18} />
        </button>

        {/* Current page name */}
        <span className="text-sm font-semibold text-white/70 tracking-wide">
          {currentPage}
        </span>

        {/* Bell + avatar */}
        <div className="flex items-center gap-2.5">
          <button className="relative text-white/35 hover:text-white transition-colors">
            <Bell size={16} strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </button>
          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">N</span>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[70] bg-black/65 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-[80] w-64 flex flex-col border-r border-white/[0.07] lg:hidden"
              style={{ background: "#0f0f0f" }}>

              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.07] flex-shrink-0">
                <div>
                  <span className="text-white text-sm font-black tracking-wider uppercase"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    Naodi <span className="text-white/35">&</span> Samri
                  </span>
                  <p className="text-white/25 text-[8px] tracking-[0.28em] uppercase font-semibold">
                    Admin Panel
                  </p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="text-white/35 hover:text-white transition-colors p-1">
                  <X size={18} />
                </button>
              </div>

              {/* Admin nav links */}
              <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
                <NavLinks />
              </nav>

              {/* Bottom: back to site + logout */}
              <div className="px-3 py-4 border-t border-white/[0.07] space-y-0.5">
                <Link href="/" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/35 hover:text-white hover:bg-white/[0.06] transition-all">
                  <Home size={15} strokeWidth={1.8} />
                  Back to Site
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/35 hover:text-red-400 hover:bg-red-500/[0.08] transition-all">
                  <LogOut size={15} strokeWidth={1.8} />
                  Log Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── DESKTOP: top bar alongside sidebar ── */}
      <header
        className="hidden lg:flex fixed top-0 left-56 right-0 z-[60] h-14 items-center justify-between px-6 border-b border-white/[0.07]"
        style={{ background: "#0f0f0f" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-white/35">
          <span>Admin</span>
          {pathname !== "/admin" && (
            <>
              <span className="text-white/20">/</span>
              <span className="text-white capitalize">
                {pathname.split("/admin/")[1]?.replace(/-/g, " ")}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative text-white/35 hover:text-white transition-colors">
            <Bell size={16} strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </button>
          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">N</span>
          </div>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      {/* 
        lg: offset left by sidebar (w-56) and top by header (h-14)
        mobile: offset top by mobile header (h-14)
      */}
      <div className="lg:pl-56 pt-14">
        <main className="p-5 md:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
