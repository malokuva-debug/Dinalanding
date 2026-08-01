"use client";

import { Reveal, SectionTag } from "@/components/reveal";
import { motion } from "framer-motion";

const STATS = [
  { v: "6+", l: "Years of artistry" },
  { v: "1.2k+", l: "Sets delivered" },
  { v: "100%", l: "Sterile, single-use kits" },
  { v: "3wk", l: "Average gel wear" },
];

export function About() {
  return (
    <section id="studio" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        {/* Image side */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative mx-auto max-w-[440px]">
            <div className="absolute -inset-6 rounded-[3rem] bg-gold/10 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border hairline">
              <img
                src="/gallery/nail-08.jpg"
                alt="Dina at work in the studio"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="glass-strong absolute -right-3 top-10 rounded-2xl px-5 py-4 md:-right-8"
            >
              <p className="font-display text-4xl text-sheen">Dina</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-mist">
                Founder & lead artist
              </p>
            </motion.div>
          </div>
        </Reveal>

        {/* Copy side */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionTag>About the studio</SectionTag>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-cream">
              Born from creativity,
              <br />
              built on <em className="text-sheen">precision.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-mist">
              DINA Nail Atelier is a dynamic, one-artist studio committed to beautiful,
              professional results. Every appointment is a private session — your nails,
              your design, and an artist who treats each set like a signature piece.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mist">
              From sculpted gel extensions to hand-painted micro-art, the studio pairs
              hospital-grade hygiene with a meticulous, slow-craft approach. No rushed
              sets. No compromises.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-cream/[0.06] sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.l} className="bg-ink-2/80 px-5 py-6">
                  <p className="font-display text-3xl text-cream">{s.v}</p>
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-mist">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
