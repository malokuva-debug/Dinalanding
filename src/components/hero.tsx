"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Sparkles, Star } from "lucide-react";
import { useBooking } from "@/components/booking-context";

const MARQUEE_ITEMS = [
  "Gel Manicure",
  "BIAB Builder",
  "Chrome Finish",
  "Hand-painted Art",
  "Gel Extensions",
  "Luxury Pedicure",
  "French Tips",
  "3D Accents",
];

export function Hero() {
  const { open } = useBooking();

  return (
    <section id="top" className="relative overflow-hidden pt-[72px]">
      {/* ambient glows — contained */}
      <div className="glow-rose pointer-events-none absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full blur-3xl" />
      <div className="glow-gold pointer-events-none absolute bottom-[-20%] left-[-12%] h-[520px] w-[520px] rounded-full blur-3xl" />

      {/* hairline grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(243 239 232 / 0.6) 1px, transparent 1px), linear-gradient(90deg, rgb(243 239 232 / 0.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28 lg:pt-24">
        {/* Copy */}
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border hairline bg-cream/[0.04] py-1.5 pl-2 pr-4"
          >
            <span className="rounded-full bg-rose/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-rose">
              Est. 2026
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-mist">
              Studio · By appointment
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-display text-[clamp(3.4rem,8.5vw,7.2rem)] leading-[0.94] tracking-tight text-cream"
          >
            The Bright
            <br />
            <em className="text-sheen pr-2">Beauty.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-mist md:text-base"
          >
            Sculpted gel, chrome finishes and hand-painted art — a one-artist atelier
            founded by Dina, built on creativity, style and obsessive precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => open()}
              className="group inline-flex items-center gap-2.5 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-rose hover:shadow-[0_0_36px_rgba(238,169,196,0.4)]"
            >
              Book a session
              <ArrowDownRight size={16} className="transition-transform group-hover:rotate-45" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border hairline bg-cream/[0.03] px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:border-rose/40 hover:text-rose"
            >
              <Sparkles size={15} />
              Explore services
            </a>
          </motion.div>

          {/* micro stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-8"
          >
            {[
              { v: "1.2k+", l: "Sets completed" },
              { v: "60+", l: "Signature designs" },
              { v: "4.9★", l: "Average rating" },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-3">
                <span className="font-display text-3xl text-cream">{s.v}</span>
                <span className="max-w-[90px] text-[11px] uppercase leading-snug tracking-[0.14em] text-mist">
                  {s.l}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[380px]"
        >
          <div className="absolute -inset-8 rounded-full bg-rose/10 blur-3xl" />

          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-b-[2rem] border hairline">
            <img
              src="/gallery/nail-06.jpg"
              alt="Sculpted gel nails by Dina"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>

          {/* floating availability card — contained */}
          <div className="glass-strong animate-float absolute -left-3 bottom-16 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl md:-left-6">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-rose/15 text-rose">
              <Star size={15} fill="currentColor" />
            </span>
            <div>
              <p className="text-[12px] font-semibold text-cream">Next slot today</p>
              <p className="text-[11px] text-mist">14:30 · Gel manicure</p>
            </div>
          </div>

          {/* spinning ring — contained */}
          <div className="animate-spin-slow pointer-events-none absolute -right-6 -top-6 h-20 w-20 md:-right-8 md:-top-8 md:h-28 md:w-28">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="circ" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-mist text-[8.5px] uppercase tracking-[0.32em]">
                <textPath href="#circ">DINA · EST 2026 ·</textPath>
              </text>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* marquee — overflow-hidden wrapper */}
      <div className="marquee-track relative border-y hairline bg-ink-2/60 py-4">
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-8 text-[13px] font-medium uppercase tracking-[0.3em] text-mist">
              {item}
              <span className="text-rose">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
