import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import BlogFilters from "./BlogFilters";
import { getPublishedBlogPosts } from "@/src/lib/services/content-public";
import { IMAGES } from "@/lib/data";

export const revalidate = 0; // always fetch fresh from DB

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts().catch(() => []);
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={IMAGES.hero3} alt="Blog" fill className="object-cover object-center" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-12 max-w-6xl mx-auto px-8 left-0 right-0">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/45 mb-3">Knowledge</p>
          <h1 style={{ fontFamily: "var(--font-serif)" }} className="text-4xl md:text-5xl font-bold text-white">
            Fitness &amp; Diet <em>Tips</em>
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-14">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ fontFamily: "var(--font-serif)" }} className="text-white/30 text-xl italic">
              Articles coming soon.
            </p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <AnimatedSection className="mb-8">
                <Link href={`/blog/${featured.id}`}>
                  <div className="card overflow-hidden group hover:border-white/20 transition-colors">
                    <div className="grid md:grid-cols-2">
                      <div className="relative h-60 md:h-72 overflow-hidden">
                        {featured.image_url && (
                          <Image src={featured.image_url} alt={featured.title} fill
                            className="object-cover transition-transform duration-600 group-hover:scale-105"
                            sizes="600px" />
                        )}
                      </div>
                      <div className="p-6 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-5">
                          <span className="text-[10px] font-semibold tracking-widest uppercase text-white/50 border border-white/15 px-3 py-1 rounded-full">
                            {featured.category}
                          </span>
                          <span className="text-[10px] tracking-widest uppercase text-white/25">Featured</span>
                        </div>
                        <h2 style={{ fontFamily: "var(--font-serif)" }}
                          className="text-xl md:text-2xl font-bold text-white mb-3 leading-snug">
                          {featured.title}
                        </h2>
                        <p className="text-white/40 text-sm leading-7 mb-5 line-clamp-3">{featured.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-white/30">
                            <span>{new Date(featured.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                            <span>{featured.author}</span>
                          </div>
                          <span className="flex items-center gap-1 text-white/60 hover:text-white text-sm font-medium transition-colors">
                            Read <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            )}

            {/* Client-side filtered grid */}
            <BlogFilters posts={rest} />
          </>
        )}
      </div>
    </div>
  );
}
