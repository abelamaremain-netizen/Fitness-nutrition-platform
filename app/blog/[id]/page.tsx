import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getBlogPost, getPublishedBlogPosts } from "@/src/lib/services/content-public";

export const revalidate = 0;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getBlogPost(id).catch(() => null);
  if (!post) notFound();

  const allPosts = await getPublishedBlogPosts().catch(() => []);
  const related  = allPosts
    .filter((p) => p.id !== id && p.category === post.category)
    .slice(0, 3);

  // All fields come from DB now
  const title    = post.title;
  const body     = post.body || post.excerpt;
  const category = post.category;
  const author   = post.author;
  const imageUrl = post.image_url;
  const date     = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {imageUrl && (
        <div className="relative h-64 md:h-96">
          <Image src={imageUrl} alt={title} fill
            className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#0d0d0d]" />
          <div className="absolute inset-0 flex flex-col items-start justify-end pb-12 max-w-3xl mx-auto px-8 left-0 right-0">
            <Link href="/blog"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[11px] tracking-widest uppercase transition-colors mb-4">
              <ArrowLeft size={13} /> Blog
            </Link>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/50 border border-white/20 px-3 py-1 rounded-full mb-3">
              {category}
            </span>
            <h1 style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {title}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-8 py-14">
        {!imageUrl && (
          <AnimatedSection className="mb-10">
            <Link href="/blog"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-[11px] tracking-widest uppercase transition-colors mb-6">
              <ArrowLeft size={13} /> Blog
            </Link>
            {category && (
              <span className="block text-[10px] font-semibold tracking-widest uppercase text-white/50 border border-white/20 px-3 py-1 rounded-full w-fit mb-4">
                {category}
              </span>
            )}
            <h1 style={{ fontFamily: "var(--font-serif)" }}
              className="text-4xl font-bold text-white leading-tight mb-4">
              {title}
            </h1>
          </AnimatedSection>
        )}

        {/* Meta */}
        <div className="flex items-center gap-5 text-[11px] text-white/30 mb-10 pb-8 border-b border-white/[0.07]">
          <span className="flex items-center gap-1.5"><Clock size={12} /> {date}</span>
          <span>By {author}</span>
        </div>

        {/* Body */}
        <AnimatedSection>
          <div className="prose-custom text-white/60 text-sm leading-8 space-y-5 whitespace-pre-line">
            {body}
          </div>
        </AnimatedSection>

        {/* Related */}
        {related.length > 0 && (
          <AnimatedSection className="mt-20">
            <h2 style={{ fontFamily: "var(--font-serif)" }}
              className="text-2xl font-bold text-white mb-8">
              More <em>Articles</em>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => {
                const rImg   = r.image_url;
                const rCat   = r.category;
                const rTitle = r.title;
                return (
                  <Link key={r.id} href={`/blog/${r.id}`}>
                    <div className="card overflow-hidden group hover:border-white/20 transition-colors">
                      {rImg && (
                        <div className="relative h-36 overflow-hidden">
                          <Image src={rImg} alt={rTitle} fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="300px" />
                        </div>
                      )}
                      <div className="p-4">
                        {rCat && (
                          <span className="text-[9px] font-semibold tracking-widest uppercase text-white/35 border border-white/12 px-2 py-0.5 rounded-full">
                            {rCat}
                          </span>
                        )}
                        <h3 className="text-white text-sm font-semibold mt-2 leading-snug"
                          style={{ fontFamily: "var(--font-serif)" }}>
                          {rTitle}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </AnimatedSection>
        )}

        <div className="mt-12 pt-8 border-t border-white/[0.07]">
          <Link href="/blog"
            className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft size={12} /> All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
