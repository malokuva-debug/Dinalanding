"use client";

import { ArrowUpRight, AtSign, MapPin, Clock3 } from "lucide-react";
import { Reveal, SectionTag } from "@/components/reveal";
import { useBooking } from "@/components/booking-context";
import type { SiteSettings } from "@/lib/blocks/types";
import { DEFAULT_CONTENT } from "@/lib/blocks/defaults";

export function Footer({ settings }: { settings?: SiteSettings["footer"] }) {
  const { open } = useBooking();
  const f = settings ?? DEFAULT_CONTENT.settings.footer;

  return (
    <footer id="contact" className="relative overflow-hidden border-t hairline">
      <div className="glow-rose pointer-events-none absolute left-1/2 top-[-40%] h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <SectionTag>{f.tag}</SectionTag>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.98] tracking-tight text-cream">
              {f.heading1}
              <br />
              <em className="text-sheen">{f.headingEmphasis}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-mist">
              {f.paragraph}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <button
              onClick={() => open()}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-cream px-9 py-4 text-[15px] font-semibold text-ink transition-all hover:bg-rose hover:shadow-[0_0_44px_rgba(238,169,196,0.45)]"
            >
              {f.buttonText}
              <ArrowUpRight size={17} className="transition-transform group-hover:rotate-45" />
            </button>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 border-t hairline pt-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-cream">
              {f.brandName}<span className="align-super text-[10px] text-rose">®</span>
            </p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-mist">
              {f.brandBlurb}
            </p>
          </div>

          <div className="space-y-3 text-[13px] text-mist">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cream/60">
              Studio
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-rose" />
              {f.address}
            </p>
            <p className="flex items-start gap-2.5">
              <Clock3 size={15} className="mt-0.5 shrink-0 text-rose" />
              {f.hoursLine1}
              <br />
              {f.hoursLine2}
            </p>
          </div>

          <div className="space-y-3 text-[13px] text-mist">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cream/60">
              Connect
            </p>
            <a href={`mailto:${f.email}`} className="block transition-colors hover:text-rose">
              {f.email}
            </a>
            <a href={`tel:${f.phone}`} className="block transition-colors hover:text-rose">
              {f.phone}
            </a>
            <a
              href={f.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 transition-colors hover:border-rose/40 hover:text-rose"
            >
              <AtSign size={14} /> {f.instagramHandle}
            </a>
          </div>
        </div>

        <div className="mt-14 border-t hairline pt-7 text-center text-[12px] text-mist/70">
          <p>{f.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
