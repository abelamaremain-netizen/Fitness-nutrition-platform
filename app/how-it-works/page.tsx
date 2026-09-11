import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getHowItWorksSteps } from "@/src/lib/services/content-public";
import { IMAGES } from "@/lib/data";

export const revalidate = 0; // always fetch fresh from DB

const FEATURES = [
  "Instant PDF download after purchase",
  "Video content via YouTube / Vimeo",
  "Amharic & English plan documents",
  "Normal, Pro, and VIP levels",
  "BMI-based plan recommendations",
  "Secure payment via Chapa & Stripe",
  "Mobile-friendly access",
  "Expert-reviewed plans",
];

export default async function HowItWorksPage() {
  const steps = await getHowItWorksSteps().catch(() => []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="pt-36 pb-16 text-center px-8">
        <AnimatedSection>
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Process</p>
          <h1 style={{ fontFamily: "var(--font-serif)" }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            How <em>It Works</em>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
            From your first visit to your first result — four steps to a better you.
          </p>
        </AnimatedSection>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-24">
        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            const imgSrc = step.image_url ?? IMAGES.hero1;
            return (
              <AnimatedSection key={step.id} direction={isEven ? "left" : "right"}>
                <div className={`grid md:grid-cols-2 gap-12 items-center`}>
                  <div className={!isEven ? "md:order-2" : ""}>
                    <p className="text-8xl font-black leading-none mb-5"
                      style={{ color: "rgba(255,255,255,0.04)", fontFamily: "var(--font-serif)" }}>
                      0{step.step_number}
                    </p>
                    <div className="w-11 h-11 card rounded-xl flex items-center justify-center mb-5">
                      <span className="text-white/60 font-bold text-sm">0{step.step_number}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                      {step.title}
                    </h2>
                    <p className="text-white/45 text-base leading-relaxed">{step.description}</p>
                    {i === steps.length - 1 && (
                      <Link href="/plans" className="btn btn-white mt-8 inline-flex">
                        Browse Plans <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                  <div className={`relative h-72 md:h-96 rounded-2xl overflow-hidden ${!isEven ? "md:order-1" : ""}`}>
                    <Image src={imgSrc} alt={step.title} fill className="object-cover" sizes="600px" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-black font-black text-base">0{step.step_number}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Features */}
        <AnimatedSection className="mt-24">
          <div className="card p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Included</p>
                <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-serif)" }}>
                  Everything you need<br /><em>to succeed</em>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FEATURES.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-white/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-white/55 text-sm leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                <Image src={IMAGES.hero3} alt="Features" fill className="object-cover" sizes="500px" />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="text-center mt-20">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Ready to get <em>started?</em>
          </h2>
          <p className="text-white/40 text-sm mb-8">Calculate your BMI and find your perfect plan.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bmi" className="btn btn-white py-3.5 px-10">
              Calculate BMI <ArrowRight size={14} />
            </Link>
            <Link href="/plans" className="btn btn-outline py-3.5 px-10">Browse Plans</Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
