"use client";

import { Reveal, SectionTag } from "@/components/reveal";
import { motion } from "framer-motion";
import type { AboutBlock } from "@/lib/blocks/types";

export function AboutBlockView({ data }: { data: AboutBlock["data"] }) {
  return (
    <section id="studio" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative mx-auto max-w-[440px]">
            <div className="absolute -inset-6 rounded-[3rem] bg-gold/10 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border hairline">
              <img
                src={data.image}
                alt={data.imageAlt}
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
              <p className="font-display text-4xl text-sheen">{data.badgeName}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-mist">
                {data.badgeRole}
              </p>
            </motion.div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionTag>{data.tag}</SectionTag>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-cream">
              {data.heading1}
              <br />
              {data.heading2} <em className="text-sheen">{data.headingEmphasis}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-mist">{data.paragraph1}</p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mist">{data.paragraph2}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-cream/[0.06] sm:grid-cols-4">
              {data.stats.map((s) => (
                <div key={s.id} className="bg-ink-2/80 px-5 py-6">
                  <p className="font-display text-3xl text-cream">{s.value}</p>
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-mist">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
