"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionTag } from "@/components/reveal";
import { useBooking } from "@/components/booking-context";
import type { RichTextBlock, ImageBannerBlock, StatsBlock, CtaBlock, SpacerBlock } from "@/lib/blocks/types";

export function RichTextBlockView({ data }: { data: RichTextBlock["data"] }) {
  const centered = data.align === "center";
  return (
    <section className={`mx-auto max-w-4xl px-5 py-20 md:px-8 ${centered ? "text-center" : ""}`}>
      <Reveal>
        <SectionTag>{data.tag}</SectionTag>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] tracking-tight text-cream">
          {data.heading}
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className={`mt-5 whitespace-pre-line text-[15px] leading-relaxed text-mist ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {data.body}
        </p>
      </Reveal>
    </section>
  );
}

export function ImageBannerBlockView({ data }: { data: ImageBannerBlock["data"] }) {
  const heightClass =
    data.heightClass === "short" ? "h-[220px]" : data.heightClass === "tall" ? "h-[520px]" : "h-[360px]";
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <Reveal className={`relative overflow-hidden rounded-3xl border hairline ${heightClass}`}>
        <img src={data.image} alt={data.caption} className="h-full w-full object-cover" loading="lazy" />
        {data.caption && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-6">
            <span className="text-[13px] font-medium uppercase tracking-[0.18em] text-cream">
              {data.caption}
            </span>
          </div>
        )}
      </Reveal>
    </section>
  );
}

export function StatsBlockView({ data }: { data: StatsBlock["data"] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-cream/[0.06] sm:grid-cols-4">
          {data.items.map((s) => (
            <div key={s.id} className="bg-ink-2/80 px-5 py-6 text-center">
              <p className="font-display text-3xl text-cream">{s.value}</p>
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-mist">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function CtaBlockView({ data }: { data: CtaBlock["data"] }) {
  const { open } = useBooking();
  return (
    <section className="relative mx-auto max-w-5xl px-5 py-20 text-center md:px-8">
      <Reveal>
        <SectionTag>{data.tag}</SectionTag>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98] tracking-tight text-cream">
          {data.heading1} <em className="text-sheen">{data.headingEmphasis}</em>
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-mist">{data.paragraph}</p>
      </Reveal>
      <Reveal delay={0.24}>
        <button
          onClick={() => open()}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-cream px-9 py-4 text-[15px] font-semibold text-ink transition-all hover:bg-rose hover:shadow-[0_0_44px_rgba(238,169,196,0.45)]"
        >
          {data.buttonText}
          <ArrowUpRight size={17} className="transition-transform group-hover:rotate-45" />
        </button>
      </Reveal>
    </section>
  );
}

export function SpacerBlockView({ data }: { data: SpacerBlock["data"] }) {
  return <div style={{ height: `${data.heightPx}px` }} aria-hidden />;
}
