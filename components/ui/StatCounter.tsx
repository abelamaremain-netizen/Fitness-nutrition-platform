"use client";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function StatCounter({ value, suffix, label, duration = 1800 }: { value: number; suffix: string; label: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const inc = value / (duration / 16);
    const t = setInterval(() => {
      n += inc;
      if (n >= value) { setCount(value); clearInterval(t); }
      else setCount(Math.floor(n));
    }, 16);
    return () => clearInterval(t);
  }, [inView, value, duration]);

  return (
    <div ref={ref} className="text-center py-10 px-4"
      style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="text-4xl md:text-5xl font-black text-white mb-1.5"
        style={{ fontFamily: "var(--font-serif)" }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">{label}</p>
    </div>
  );
}
