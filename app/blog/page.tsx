"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Search } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { BLOG_POSTS, IMAGES } from "@/lib/data";

const CATEGORIES = ["All", "Nutrition", "Training", "Health", "Recovery"];

export default function BlogPage() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = BLOG_POSTS.filter((p) => {
    const matchCat = active === "All" || p.category === active;
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={IMAGES.hero3} alt="Blog" fill className="object-cover object-center" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-12 max-w-6xl mx-auto px-8 left-0 right-0">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/45 mb-3">
            Knowledge
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white">
            Fitness &amp; Diet <em>Tips</em>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-14">
        {/* Filter row */}
        <AnimatedSection className="mb-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActive(cat)}
                  className={`toggle-chip ${active === cat ? "active" : ""}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
              <input type="text" placeholder="Search articles..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pill-input pl-10 py-2.5" />
            </div>
          </div>
        </AnimatedSection>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-white/30 text-lg italic mb-3"
              style={{ fontFamily: "var(--font-serif)" }}>No articles found.</p>
            <button onClick={() => { setActive("All"); setSearch(""); }}
              className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white underline transition-colors">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <AnimatedSection className="mb-8">
                <motion.div whileHover={{ y: -3 }}
                  className="card overflow-hidden group hover:border-white/20 transition-colors">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-60 md:h-72 overflow-hidden">
                      <Image src={featured.image} alt={featured.title} fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                        sizes="600px" />
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-white/50 border border-white/15 px-3 py-1 rounded-full">
                          {featured.category}
                        </span>
                        <span className="text-[10px] tracking-widest uppercase text-white/25">Featured</span>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-3 leading-snug"
                        style={{ fontFamily: "var(--font-serif)" }}>
                        {featured.title}
                      </h2>
                      <p className="text-white/40 text-sm leading-7 mb-6 line-clamp-3">{featured.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-white/30">
                          <span className="flex items-center gap-1.5">
                            <Clock size={11} /> {featured.readTime}
                          </span>
                          <span>{featured.date}</span>
                        </div>
                        <Link href={`/blog/${featured.id}`}
                          className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors">
                          Read <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            )}

            {/* Post grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 0.07}>
                  <motion.div whileHover={{ y: -4 }}
                    className="card overflow-hidden group hover:border-white/20 transition-colors flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <Image src={post.image} alt={post.title} fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                        sizes="400px" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur text-white/70 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/15">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-white font-bold text-sm leading-snug mb-2"
                        style={{ fontFamily: "var(--font-serif)" }}>
                        {post.title}
                      </h3>
                      <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
                        <div className="flex items-center gap-3 text-[11px] text-white/28">
                          <span className="flex items-center gap-1.5"><Clock size={10} /> {post.readTime}</span>
                          <span>{post.date}</span>
                        </div>
                        <Link href={`/blog/${post.id}`}
                          className="text-white/45 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors">
                          Read <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
