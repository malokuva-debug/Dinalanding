"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Sparkles, Star } from "lucide-react";
import { useBooking } from "@/components/booking-context";
import type { HeroBlock } from "@/lib/blocks/types";
import { EditableText } from "@/components/editor/inline/editable-text";
import { EditableImage } from "@/components/editor/inline/editable-image";
import { InlineAddTile, InlineRemoveButton } from "@/components/editor/inline/inline-list-controls";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function HeroBlockView({
  data,
  editable,
  onChange,
}: {
  data: HeroBlock["data"];
  editable?: boolean;
  onChange?: (data: HeroBlock["data"]) => void;
}) {
  const { open } = useBooking();
  const set = (patch: Partial<HeroBlock["data"]>) => onChange?.({ ...data, ...patch });

  return (
    <section id="top" className="relative overflow-hidden pt-[72px]">
      <div className="glow-rose pointer-events-none absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full blur-3xl" />
      <div className="glow-gold pointer-events-none absolute bottom-[-20%] left-[-12%] h-[520px] w-[520px] rounded-full blur-3xl" />

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
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border hairline bg-cream/[0.04] py-1.5 pl-2 pr-4"
          >
            <span className="rounded-full bg-rose/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-rose">
              {editable ? (
                <EditableText value={data.eyebrowLeft} onChange={(v) => set({ eyebrowLeft: v })} />
              ) : (
                data.eyebrowLeft
              )}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-mist">
              {editable ? (
                <EditableText value={data.eyebrowRight} onChange={(v) => set({ eyebrowRight: v })} />
              ) : (
                data.eyebrowRight
              )}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-display text-[clamp(3.4rem,8.5vw,7.2rem)] leading-[0.94] tracking-tight text-cream"
          >
            {editable ? <EditableText value={data.titleLine1} onChange={(v) => set({ titleLine1: v })} /> : data.titleLine1}
            <br />
            <em className="text-sheen pr-2">
              {editable ? (
                <EditableText value={data.titleLine2Emphasis} onChange={(v) => set({ titleLine2Emphasis: v })} />
              ) : (
                data.titleLine2Emphasis
              )}
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-mist md:text-base"
          >
            {editable ? (
              <EditableText as="span" multiline value={data.paragraph} onChange={(v) => set({ paragraph: v })} />
            ) : (
              data.paragraph
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => !editable && open()}
              className="group inline-flex items-center gap-2.5 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-rose hover:shadow-[0_0_36px_rgba(238,169,196,0.4)]"
            >
              {editable ? (
                <EditableText value={data.primaryButtonText} onChange={(v) => set({ primaryButtonText: v })} />
              ) : (
                data.primaryButtonText
              )}
              <ArrowDownRight size={16} className="transition-transform group-hover:rotate-45" />
            </button>
            <a
              href={editable ? undefined : data.secondaryButtonHref}
              className="inline-flex items-center gap-2 rounded-full border hairline bg-cream/[0.03] px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:border-rose/40 hover:text-rose"
            >
              <Sparkles size={15} />
              {editable ? (
                <EditableText value={data.secondaryButtonText} onChange={(v) => set({ secondaryButtonText: v })} />
              ) : (
                data.secondaryButtonText
              )}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-8"
          >
            {data.stats.map((s) => (
              <div key={s.id} className="group/item relative flex items-center gap-3">
                {editable && (
                  <InlineRemoveButton onRemove={() => set({ stats: data.stats.filter((x) => x.id !== s.id) })} />
                )}
                <span className="font-display text-3xl text-cream">
                  {editable ? (
                    <EditableText
                      value={s.value}
                      onChange={(v) => set({ stats: data.stats.map((x) => (x.id === s.id ? { ...x, value: v } : x)) })}
                    />
                  ) : (
                    s.value
                  )}
                </span>
                <span className="max-w-[90px] text-[11px] uppercase leading-snug tracking-[0.14em] text-mist">
                  {editable ? (
                    <EditableText
                      value={s.label}
                      onChange={(v) => set({ stats: data.stats.map((x) => (x.id === s.id ? { ...x, label: v } : x)) })}
                    />
                  ) : (
                    s.label
                  )}
                </span>
              </div>
            ))}
            {editable && (
              <InlineAddTile
                label="Stat"
                className="h-10 px-3"
                onAdd={() => set({ stats: [...data.stats, { id: uid(), value: "0", label: "New stat" }] })}
              />
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[380px]"
        >
          <div className="absolute -inset-8 rounded-full bg-rose/10 blur-3xl" />

          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-b-[2rem] border hairline">
            {editable ? (
              <EditableImage
                src={data.image}
                alt={data.imageAlt}
                onChange={(v) => set({ image: v })}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
            ) : (
              <img src={data.image} alt={data.imageAlt} className="h-full w-full object-cover" loading="eager" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>

          <div className="glass-strong animate-float absolute -left-3 bottom-16 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl md:-left-6">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-rose/15 text-rose">
              <Star size={15} fill="currentColor" />
            </span>
            <div>
              <p className="text-[12px] font-semibold text-cream">
                {editable ? (
                  <EditableText value={data.badgeTitle} onChange={(v) => set({ badgeTitle: v })} />
                ) : (
                  data.badgeTitle
                )}
              </p>
              <p className="text-[11px] text-mist">
                {editable ? (
                  <EditableText value={data.badgeSubtitle} onChange={(v) => set({ badgeSubtitle: v })} />
                ) : (
                  data.badgeSubtitle
                )}
              </p>
            </div>
          </div>

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

      <div className="marquee-track relative border-y hairline bg-ink-2/60 py-4">
        <div className={`flex w-max items-center gap-8 whitespace-nowrap ${editable ? "" : "animate-marquee"}`}>
          {(editable ? data.marqueeItems : [...data.marqueeItems, ...data.marqueeItems]).map((item, i) => (
            <span key={i} className="group/item relative flex items-center gap-8 text-[13px] font-medium uppercase tracking-[0.3em] text-mist">
              {editable ? (
                <EditableText
                  value={item}
                  onChange={(v) => set({ marqueeItems: data.marqueeItems.map((x, idx) => (idx === i ? v : x)) })}
                />
              ) : (
                item
              )}
              <span className="text-rose">✦</span>
              {editable && (
                <InlineRemoveButton
                  label="Remove marquee item"
                  onRemove={() => set({ marqueeItems: data.marqueeItems.filter((_, idx) => idx !== i) })}
                />
              )}
            </span>
          ))}
          {editable && (
            <InlineAddTile
              label="Item"
              className="h-8 px-3"
              onAdd={() => set({ marqueeItems: [...data.marqueeItems, "New item"] })}
            />
          )}
        </div>
      </div>
    </section>
  );
}
