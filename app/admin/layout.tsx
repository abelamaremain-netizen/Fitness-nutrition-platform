"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  FileText, Menu, X, LogOut, Bell, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin",           label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/plans",     label: "Plans",       icon: Package },
  { href: "/admin/orders",    label: "Orders",      icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers",   icon: Users },
  { href: "/admin/content",   label: "Content",     icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.07]">
        <Link href="/" className="block">
          <span className="text-white text-sm font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-serif)" }}>
            Naodi <span className="text-white/40">&</span> Samri
          </span>
          <span className="block text-white/30 text-[9px] font-semibold tracking-[0.3em] uppercase mt-0.5">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive(href)
                ? "bg-white text-black"
                : "text-white/50 hover:text-white hover:bg-white/[0.06]"
            }`}>
            <Icon size={16} strokeWidth={1.8} />
            {label}
            {isActive(href) && (
              <ChevronRight size={12} className="ml-auto" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07] space-y-0.5">
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/35 hover:text-white hover:bg-white/[0.06] transition-all">
          <LogOut size={15} strokeWidth={1.8} />
          Back to Site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a0a" }}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/[0.07]"
        style={{ background: "#0f0f0f" }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-56 border-r border-white/[0.07] lg:hidden"
              style={{ background: "#0f0f0f" }}>
              <div className="absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)}
                  className="text-white/40 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-5 border-b border-white/[0.07] flex-shrink-0"
          style={{ background: "#0f0f0f" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/40 hover:text-white transition-colors">
              <Menu size={18} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/35">
              <span>Admin</span>
              {pathname !== "/admin" && (
                <>
                  <span>/</span>
                  <span className="text-white capitalize">
                    {pathname.split("/admin/")[1]?.replace("-", " ")}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-white/40 hover:text-white transition-colors">
              <Bell size={17} strokeWidth={1.8} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">N</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
