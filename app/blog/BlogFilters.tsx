"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import type { BlogPost } from "@/src/types/database.types";

const CATEGORIES = ["All", "Nutrition", "Training", "Health", "Recovery"];

export default function BlogFilters({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    const matchCat = active === "All" || p.category === active;
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-5 mb-10">
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
          <input type="text" placeholder="Search articles…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pill-input pl-10 py-2.5" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm italic">No articles found.</p>
          <button onClick={() => { setActive("All"); setSearch(""); }}
            className="mt-3 text-[11px] tracking-widest uppercase text-white/35 hover:text-white underline transition-colors">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div key={post.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>
              <Link href={`/blog/${post.id}`}>
                <div className="card overflow-hidden group hover:border-white/20 transition-colors flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    {post.image_url && (
                      <Image src={post.image_url} alt={post.title} fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                        sizes="400px" />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/70 backdrop-blur text-white/70 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/15">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 style={{ fontFamily: "var(--font-serif)" }}
                      className="text-white font-bold text-sm leading-snug mb-2">
                      {post.title}
                    </h3>
                    <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
                      <span className="text-[11px] text-white/28">
                        {new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-white/45 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors">
                        Read <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
