"use client";

import { ArrowUpRight, AtSign, MapPin, Clock3 } from "lucide-react";
import { Reveal, SectionTag } from "@/components/reveal";
import { useBooking } from "@/components/booking-context";

export function Footer() {
  const { open } = useBooking();

  return (
    <footer id="contact" className="relative overflow-hidden border-t hairline">
      <div className="glow-rose pointer-events-none absolute left-1/2 top-[-40%] h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <SectionTag>Collaborate with us</SectionTag>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.98] tracking-tight text-cream">
              Your nails,
              <br />
              <em className="text-sheen">our obsession.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-mist">
              Sessions are limited to keep every set flawless. Book online — or reach out
              for bridal parties and custom commissions.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <button
              onClick={() => open()}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-cream px-9 py-4 text-[15px] font-semibold text-ink transition-all hover:bg-rose hover:shadow-[0_0_44px_rgba(238,169,196,0.45)]"
            >
              Book a session
              <ArrowUpRight size={17} className="transition-transform group-hover:rotate-45" />
            </button>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 border-t hairline pt-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-cream">
              DINA<span className="align-super text-[10px] text-rose">®</span>
            </p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-mist">
              Nail Atelier · The Bright Beauty. Sculpted gel, chrome and hand-painted art,
              by appointment only.
            </p>
          </div>

          <div className="space-y-3 text-[13px] text-mist">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cream/60">
              Studio
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-rose" />
              12 Rosewood Lane, Suite 3 — Downtown
            </p>
            <p className="flex items-start gap-2.5">
              <Clock3 size={15} className="mt-0.5 shrink-0 text-rose" />
              Tue – Sat · 9:00 — 18:00
              <br />
              Sundays by request
            </p>
          </div>

          <div className="space-y-3 text-[13px] text-mist">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cream/60">
              Connect
            </p>
            <a href="mailto:hello@dinanails.studio" className="block transition-colors hover:text-rose">
              hello@dinanails.studio
            </a>
            <a href="tel:+15550001234" className="block transition-colors hover:text-rose">
              +1 555 000 1234
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 transition-colors hover:border-rose/40 hover:text-rose"
            >
              <AtSign size={14} /> @dina.nails
            </a>
          </div>
        </div>

        <div className="mt-14 border-t hairline pt-7 text-center text-[12px] text-mist/70">
          <p>© 2026 DINA Nail Atelier. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
