"use client";

import { Reveal, SectionTag } from "@/components/reveal";
import type { GalleryBlock } from "@/lib/blocks/types";
import { EditableText } from "@/components/editor/inline/editable-text";
import { EditableImage } from "@/components/editor/inline/editable-image";
import { InlineAddTile, InlineRemoveButton } from "@/components/editor/inline/inline-list-controls";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function GalleryBlockView({
  data,
  editable,
  onChange,
}: {
  data: GalleryBlock["data"];
  editable?: boolean;
  onChange?: (data: GalleryBlock["data"]) => void;
}) {
  const set = (patch: Partial<GalleryBlock["data"]>) => onChange?.({ ...data, ...patch });

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <SectionTag>{editable ? <EditableText value={data.tag} onChange={(v) => set({ tag: v })} /> : data.tag}</SectionTag>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-cream">
              {editable ? <EditableText value={data.heading1} onChange={(v) => set({ heading1: v })} /> : data.heading1}
              {(editable || data.heading1) ? <br /> : null}
              {editable ? (
                <EditableText value={data.heading2} onChange={(v) => set({ heading2: v })} />
              ) : data.heading2 ? (
                <>{data.heading2} </>
              ) : null}{" "}
              <em className="text-sheen">
                {editable ? (
                  <EditableText value={data.headingEmphasis} onChange={(v) => set({ headingEmphasis: v })} />
                ) : (
                  data.headingEmphasis
                )}
              </em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.16}>
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            {editable ? (
              <EditableText as="span" multiline value={data.paragraph} onChange={(v) => set({ paragraph: v })} />
            ) : (
              data.paragraph
            )}
          </p>
        </Reveal>
      </div>

      <div className="mt-14 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {data.items.map((shot, i) => (
          <Reveal key={shot.id} delay={(i % 3) * 0.05} className="group/item relative break-inside-avoid">
            <figure className="group relative overflow-hidden rounded-2xl border hairline">
              {editable ? (
                <EditableImage
                  src={shot.src}
                  alt={shot.label}
                  onChange={(v) => set({ items: data.items.map((x) => (x.id === shot.id ? { ...x, src: v } : x)) })}
                  imgClassName={`w-full object-cover ${i % 5 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"}`}
                />
              ) : (
                <img
                  src={shot.src}
                  alt={shot.label}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    i % 5 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"
                  }`}
                />
              )}
              <figcaption
                className={`absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-ink/80 via-transparent to-transparent p-4 transition-opacity duration-500 ${
                  editable ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-cream">
                  {editable ? (
                    <EditableText
                      value={shot.label}
                      onChange={(v) => set({ items: data.items.map((x) => (x.id === shot.id ? { ...x, label: v } : x)) })}
                    />
                  ) : (
                    shot.label
                  )}
                </span>
              </figcaption>
            </figure>
            {editable && (
              <InlineRemoveButton
                label="Remove photo"
                onRemove={() => set({ items: data.items.filter((x) => x.id !== shot.id) })}
              />
            )}
          </Reveal>
        ))}
        {editable && (
          <InlineAddTile
            label="Photo"
            className="mb-4 aspect-[3/4] w-full break-inside-avoid"
            onAdd={() => set({ items: [...data.items, { id: uid(), src: "/gallery/nail-01.jpg", label: "New photo" }] })}
          />
        )}
      </div>
    </section>
  );
}
