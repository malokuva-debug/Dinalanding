"use client";

import { Reveal, SectionTag } from "@/components/reveal";
import type { GalleryBlock } from "@/lib/blocks/types";

export function GalleryBlockView({ data }: { data: GalleryBlock["data"] }) {
  return (
    <section id="work" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
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

      <div className="mt-14 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {data.items.map((shot, i) => (
          <Reveal key={shot.id} delay={(i % 3) * 0.05} className="break-inside-avoid">
            <figure className="group relative overflow-hidden rounded-2xl border hairline">
              <img
                src={shot.src}
                alt={shot.label}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i % 5 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"
                }`}
              />
              <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-cream">
                  {shot.label}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
