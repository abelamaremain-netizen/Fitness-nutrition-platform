import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import StatCounter from "@/components/ui/StatCounter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Naodi & Samri — certified fitness coaches and nutrition specialists from Ethiopia. Learn our story, mission, and why we built this platform.",
  alternates: { canonical: "/about" },
  openGraph: {
    title:       "About Naodi & Samri Fitness",
    description: "Real coaches. Real results. Every plan on this platform is designed and tested by Naodi & Samri themselves.",
    url:         "/about",
  },
};
import { getTeamMembers, getSiteContent } from "@/src/lib/services/content-public";
import { parseStats, IMAGES } from "@/lib/data";

export const revalidate = 0;

export default async function AboutPage() {
  const [teamMembers, content] = await Promise.all([
    getTeamMembers().catch(() => []),
    getSiteContent().catch(() => ({} as Record<string, string>)),
  ]);

  const missionStatement = content.mission_statement ||
    "Making expert fitness accessible to everyone.";
  const stats = parseStats(content);

  // Story paragraphs — editable from admin content page
  const storyPara1 = content.about_story_1 || "";
  const storyPara2 = content.about_story_2 || "";

  // Values — editable from admin (value_1_title, value_1_desc … value_4_title, value_4_desc)
  const values = [1, 2, 3, 4].map((n) => ({
    title:       content[`value_${n}_title`] ?? "",
    description: content[`value_${n}_desc`]  ?? "",
  })).filter((v) => v.title);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-[480px]">
        <Image src={IMAGES.both} alt="Naodi & Samri" fill className="object-cover object-top" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-[#0d0d0d]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pt-16">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/45 mb-4">Our Story</p>
          <h1 style={{ fontFamily: "var(--font-serif)" }} className="text-5xl md:text-6xl font-bold text-white">
            About <em>Naodi &amp; Samri</em>
          </h1>
        </div>
      </div>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-5">Our Mission</p>
            <h2 className="text-4xl font-bold text-white mb-7 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              {missionStatement}
            </h2>
            {storyPara1 && (
              <p className="text-white/45 text-sm leading-8 mb-5">{storyPara1}</p>
            )}
            {storyPara2 && (
              <p className="text-white/45 text-sm leading-8 mb-8">{storyPara2}</p>
            )}
            {!storyPara1 && !storyPara2 && (
              <p className="text-white/25 text-sm mb-8">
                Add your story in Admin → Content → About Us.
              </p>
            )}
            <Link href="/plans" className="btn btn-white py-3.5 px-8 inline-flex">
              Browse Our Plans <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.1}>
            <div className="grid grid-cols-2 gap-4 h-[420px]">
              <div className="relative rounded-2xl overflow-hidden row-span-2">
                <Image src={IMAGES.naodi3} alt="Naodi" fill className="object-cover object-top" sizes="300px" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={IMAGES.samri2} alt="Samri" fill className="object-cover object-top" sizes="200px" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={IMAGES.samri1} alt="Samri training" fill className="object-cover object-top" sizes="200px" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* Team — from Supabase */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">The Founders</p>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              Meet <em>the Team</em>
            </h2>
          </AnimatedSection>

          {teamMembers.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-12">
              No team members yet — add them in Admin → Content → Team / Experts.
            </p>
          ) : teamMembers.map((member, i) => {
            const isEven = i % 2 === 0;
            // Use image from DB, fall back to owner photos based on name
            const imgSrc = member.image_url
              ? member.image_url
              : member.name.toLowerCase().includes("naodi") ? IMAGES.naodi2
              : member.name.toLowerCase().includes("samri") ? IMAGES.samri2
              : IMAGES.hero1;
            return (
              <AnimatedSection key={member.id} className={`mb-16 ${i > 0 ? "mt-0" : ""}`}>
                <div className="grid md:grid-cols-2 gap-0 card overflow-hidden">
                  <div className={`relative h-[520px] ${!isEven ? "md:order-2" : ""}`}>
                    <Image src={imgSrc} alt={member.name} fill className="object-cover object-top" sizes="600px" />
                  </div>
                  <div className={`flex flex-col justify-center p-10 md:p-14 ${!isEven ? "md:order-1" : ""}`}>
                    <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/35 mb-3">
                      {member.role}
                    </p>
                    <h3 className="text-4xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-serif)" }}>
                      {member.name}
                    </h3>
                    <p className="text-white/50 text-sm leading-8">{member.bio}</p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="py-24" style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/35 mb-4">Values</p>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              What We <em>Stand For</em>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.length > 0 ? values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="card p-7 h-full hover:border-white/20 transition-colors">
                  <h3 className="text-white font-bold text-base mb-3">{v.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{v.description}</p>
                </div>
              </AnimatedSection>
            )) : (
              <p className="text-white/25 text-sm col-span-4 text-center py-8">
                Add your values in Admin → Content → About Us Values.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection>
            <div className="card p-12 md:p-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                Ready to start your<br /><em>transformation?</em>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Start with a free BMI calculation and get your personalised plan recommendation from Naodi &amp; Samri in minutes.
              </p>
              <Link href="/bmi" className="btn btn-white py-3.5 px-10 inline-flex">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
