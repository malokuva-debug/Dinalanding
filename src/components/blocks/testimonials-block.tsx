"use client";

import { Star } from "lucide-react";
import { Reveal, SectionTag } from "@/components/reveal";
import type { TestimonialsBlock } from "@/lib/blocks/types";

function Stars() {
  return (
    <div className="flex gap-1 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill="currentColor" />
      ))}
    </div>
  );
}

export function TestimonialsBlockView({ data }: { data: TestimonialsBlock["data"] }) {
  return (
    <section id="reviews" className="relative border-t hairline bg-ink-2/40 py-24 lg:py-32">
      <div className="glow-gold pointer-events-none absolute bottom-0 right-[-10%] h-[420px] w-[520px] rounded-full blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <SectionTag>{data.tag}</SectionTag>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-cream">
                {data.heading1}
                {data.heading1 ? <br /> : null}
                {data.heading2 ? <>{data.heading2} </> : null}
                <em className="text-sheen">{data.headingEmphasis}</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <p className="max-w-xs text-sm leading-relaxed text-mist">{data.paragraph}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {data.items.map((r, i) => (
            <Reveal
              key={r.id}
              delay={i * 0.07}
              className={r.featured ? "md:col-span-2 lg:row-span-1" : ""}
            >
              <figure
                className={`flex h-full flex-col rounded-3xl p-7 ${
                  r.featured
                    ? "border border-rose/25 bg-gradient-to-br from-rose/12 via-ink-2 to-ink-2"
                    : "glass"
                }`}
              >
                <Stars />
                <blockquote
                  className={`mt-5 leading-relaxed text-cream/90 ${
                    r.featured ? "font-display text-[22px]" : "text-[14px]"
                  }`}
                >
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-cream/8 font-display text-lg text-rose">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-cream">{r.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-mist">{r.service}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
