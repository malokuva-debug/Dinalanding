"use client";

import { Reveal, SectionTag } from "@/components/reveal";
import { motion } from "framer-motion";
import type { AboutBlock } from "@/lib/blocks/types";
import { EditableText } from "@/components/editor/inline/editable-text";
import { EditableImage } from "@/components/editor/inline/editable-image";
import { InlineAddTile, InlineRemoveButton } from "@/components/editor/inline/inline-list-controls";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function AboutBlockView({
  data,
  editable,
  onChange,
}: {
  data: AboutBlock["data"];
  editable?: boolean;
  onChange?: (data: AboutBlock["data"]) => void;
}) {
  const set = (patch: Partial<AboutBlock["data"]>) => onChange?.({ ...data, ...patch });

  return (
    <section id="studio" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative mx-auto max-w-[440px]">
            <div className="absolute -inset-6 rounded-[3rem] bg-gold/10 blur-3xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border hairline">
              {editable ? (
                <EditableImage
                  src={data.image}
                  alt={data.imageAlt}
                  onChange={(v) => set({ image: v })}
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={data.image}
                  alt={data.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="glass-strong absolute -right-3 top-10 rounded-2xl px-5 py-4 md:-right-8"
            >
              <p className="font-display text-4xl text-sheen">
                {editable ? <EditableText value={data.badgeName} onChange={(v) => set({ badgeName: v })} /> : data.badgeName}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-mist">
                {editable ? <EditableText value={data.badgeRole} onChange={(v) => set({ badgeRole: v })} /> : data.badgeRole}
              </p>
            </motion.div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionTag>{editable ? <EditableText value={data.tag} onChange={(v) => set({ tag: v })} /> : data.tag}</SectionTag>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-cream">
              {editable ? <EditableText value={data.heading1} onChange={(v) => set({ heading1: v })} /> : data.heading1}
              <br />
              {editable ? <EditableText value={data.heading2} onChange={(v) => set({ heading2: v })} /> : data.heading2}{" "}
              <em className="text-sheen">
                {editable ? (
                  <EditableText value={data.headingEmphasis} onChange={(v) => set({ headingEmphasis: v })} />
                ) : (
                  data.headingEmphasis
                )}
              </em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-mist">
              {editable ? (
                <EditableText as="span" multiline value={data.paragraph1} onChange={(v) => set({ paragraph1: v })} />
              ) : (
                data.paragraph1
              )}
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mist">
              {editable ? (
                <EditableText as="span" multiline value={data.paragraph2} onChange={(v) => set({ paragraph2: v })} />
              ) : (
                data.paragraph2
              )}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-cream/[0.06] sm:grid-cols-4">
              {data.stats.map((s) => (
                <div key={s.id} className="group/item relative bg-ink-2/80 px-5 py-6">
                  {editable && (
                    <InlineRemoveButton onRemove={() => set({ stats: data.stats.filter((x) => x.id !== s.id) })} />
                  )}
                  <p className="font-display text-3xl text-cream">
                    {editable ? (
                      <EditableText
                        value={s.value}
                        onChange={(v) => set({ stats: data.stats.map((x) => (x.id === s.id ? { ...x, value: v } : x)) })}
                      />
                    ) : (
                      s.value
                    )}
                  </p>
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-mist">
                    {editable ? (
                      <EditableText
                        value={s.label}
                        onChange={(v) => set({ stats: data.stats.map((x) => (x.id === s.id ? { ...x, label: v } : x)) })}
                      />
                    ) : (
                      s.label
                    )}
                  </p>
                </div>
              ))}
              {editable && (
                <div className="flex items-center justify-center bg-ink-2/40 px-5 py-6">
                  <InlineAddTile
                    label="Stat"
                    className="h-10 w-full"
                    onAdd={() => set({ stats: [...data.stats, { id: uid(), value: "0", label: "New stat" }] })}
                  />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
