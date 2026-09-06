import Image from "next/image";
import { Star, Quote } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import StatCounter from "@/components/ui/StatCounter";
import { getPublishedTestimonials } from "@/src/lib/services/content-public";
import { STATS, IMAGES, TESTIMONIALS } from "@/lib/data";

export const revalidate = 60;

export default async function TestimonialsPage() {
  const dbTestimonials = await getPublishedTestimonials().catch(() => []);

  // Fallback to hardcoded if DB empty
  const testimonials = dbTestimonials.length > 0
    ? dbTestimonials
    : TESTIMONIALS.map((t) => ({
        id: String(t.id),
        name: t.name,
        role: t.role,
        text: t.text,
        plan_name: t.plan,
        image_url: t.image,
        rating: t.rating,
        published: true,
        sort_order: t.id,
        created_at: "",
      }));

  const [featured, ...rest] = testimonials;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <Image src={IMAGES.hero5} alt="Testimonials" fill
          className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col items-start justify-end pb-12 max-w-6xl mx-auto px-8 left-0 right-0">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/45 mb-3">
            Success Stories
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)" }}
            className="text-4xl md:text-5xl font-bold text-white">
            Real People. <em>Real Results.</em>
          </h1>
        </div>
      </div>

      {/* Stats */}
      <section style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* Featured testimonial */}
      {featured && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-8">
            <AnimatedSection>
              <div className="card p-10 md:p-14 relative overflow-hidden">
                <Quote size={80} className="absolute top-6 right-8 text-white/[0.04]" />
                <div className="flex gap-1 mb-7">
                  {Array.from({ length: featured.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-white/60 fill-white/60" />
                  ))}
                </div>
                <p className="text-white/70 text-xl md:text-2xl leading-relaxed italic mb-8 max-w-3xl"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  &ldquo;{featured.text}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  {featured.image_url && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
                      <Image src={featured.image_url} alt={featured.name} fill
                        className="object-cover" sizes="48px" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold">{featured.name}</p>
                    <p className="text-white/35 text-xs mt-0.5">{featured.role}</p>
                    {featured.plan_name && (
                      <p className="text-white/22 text-xs">{featured.plan_name}</p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Testimonials grid */}
      {rest.length > 0 && (
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((t, i) => (
                <AnimatedSection key={t.id} delay={i * 0.07}>
                  <div className="card p-7 h-full hover:border-white/20 transition-colors flex flex-col">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} size={12} className="text-white/55 fill-white/55" />
                        ))}
                      </div>
                      <Quote size={18} className="text-white/[0.08]" />
                    </div>
                    <p className="text-white/45 text-sm leading-7 italic flex-1 mb-6">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-5 border-t border-white/[0.07]">
                      {t.image_url && (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/12 flex-shrink-0">
                          <Image src={t.image_url} alt={t.name} fill
                            className="object-cover" sizes="36px" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        <p className="text-white/30 text-[11px] mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Transformation photos */}
      <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              Transformations
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[IMAGES.hero1, IMAGES.hero2, IMAGES.hero4, IMAGES.hero6].map((img, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image src={img} alt={`Transformation ${i + 1}`} fill
                    className="object-cover" sizes="300px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-xs font-semibold">
                      {["Lost 12kg", "Built Muscle", "Power Shred", "Toning Result"][i]}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
