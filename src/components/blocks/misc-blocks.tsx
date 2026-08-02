"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionTag } from "@/components/reveal";
import { useBooking } from "@/components/booking-context";
import type { RichTextBlock, ImageBannerBlock, StatsBlock, CtaBlock, SpacerBlock } from "@/lib/blocks/types";
import { EditableText } from "@/components/editor/inline/editable-text";
import { EditableImage } from "@/components/editor/inline/editable-image";
import { InlineAddTile, InlineRemoveButton } from "@/components/editor/inline/inline-list-controls";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function InlineToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      data-editor-ui="true"
      className="absolute left-2 top-2 z-20 flex gap-0.5 rounded-full border hairline bg-ink-2/95 p-0.5 opacity-0 shadow-lg backdrop-blur transition-opacity group-hover/canvas:opacity-100"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(o.value);
          }}
          className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium transition-colors ${
            value === o.value ? "bg-cream text-ink" : "text-mist hover:text-cream"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function RichTextBlockView({
  data,
  editable,
  onChange,
}: {
  data: RichTextBlock["data"];
  editable?: boolean;
  onChange?: (data: RichTextBlock["data"]) => void;
}) {
  const set = (patch: Partial<RichTextBlock["data"]>) => onChange?.({ ...data, ...patch });
  const centered = data.align === "center";
  return (
    <section className={`relative mx-auto max-w-4xl px-5 py-20 md:px-8 ${centered ? "text-center" : ""}`}>
      {editable && (
        <InlineToggleGroup
          value={data.align}
          onChange={(v) => set({ align: v })}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
          ]}
        />
      )}
      <Reveal>
        <SectionTag>{editable ? <EditableText value={data.tag} onChange={(v) => set({ tag: v })} /> : data.tag}</SectionTag>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] tracking-tight text-cream">
          {editable ? <EditableText value={data.heading} onChange={(v) => set({ heading: v })} /> : data.heading}
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className={`mt-5 whitespace-pre-line text-[15px] leading-relaxed text-mist ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {editable ? (
            <EditableText as="span" multiline value={data.body} onChange={(v) => set({ body: v })} />
          ) : (
            data.body
          )}
        </p>
      </Reveal>
    </section>
  );
}

export function ImageBannerBlockView({
  data,
  editable,
  onChange,
}: {
  data: ImageBannerBlock["data"];
  editable?: boolean;
  onChange?: (data: ImageBannerBlock["data"]) => void;
}) {
  const set = (patch: Partial<ImageBannerBlock["data"]>) => onChange?.({ ...data, ...patch });
  const heightClass =
    data.heightClass === "short" ? "h-[220px]" : data.heightClass === "tall" ? "h-[520px]" : "h-[360px]";
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-10 md:px-8">
      {editable && (
        <InlineToggleGroup
          value={data.heightClass}
          onChange={(v) => set({ heightClass: v })}
          options={[
            { value: "short", label: "Short" },
            { value: "medium", label: "Medium" },
            { value: "tall", label: "Tall" },
          ]}
        />
      )}
      <Reveal className={`relative overflow-hidden rounded-3xl border hairline ${heightClass}`}>
        {editable ? (
          <EditableImage
            src={data.image}
            alt={data.caption}
            onChange={(v) => set({ image: v })}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
        ) : (
          <img src={data.image} alt={data.caption} className="h-full w-full object-cover" loading="lazy" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-6">
          <span className="text-[13px] font-medium uppercase tracking-[0.18em] text-cream">
            {editable ? (
              <EditableText value={data.caption} onChange={(v) => set({ caption: v })} placeholder="Caption…" />
            ) : (
              data.caption
            )}
          </span>
        </div>
      </Reveal>
    </section>
  );
}

export function StatsBlockView({
  data,
  editable,
  onChange,
}: {
  data: StatsBlock["data"];
  editable?: boolean;
  onChange?: (data: StatsBlock["data"]) => void;
}) {
  const set = (patch: Partial<StatsBlock["data"]>) => onChange?.({ ...data, ...patch });
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-cream/[0.06] sm:grid-cols-4">
          {data.items.map((s) => (
            <div key={s.id} className="group/item relative bg-ink-2/80 px-5 py-6 text-center">
              {editable && (
                <InlineRemoveButton onRemove={() => set({ items: data.items.filter((x) => x.id !== s.id) })} />
              )}
              <p className="font-display text-3xl text-cream">
                {editable ? (
                  <EditableText
                    value={s.value}
                    onChange={(v) => set({ items: data.items.map((x) => (x.id === s.id ? { ...x, value: v } : x)) })}
                  />
                ) : (
                  s.value
                )}
              </p>
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-mist">
                {editable ? (
                  <EditableText
                    value={s.label}
                    onChange={(v) => set({ items: data.items.map((x) => (x.id === s.id ? { ...x, label: v } : x)) })}
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
                onAdd={() => set({ items: [...data.items, { id: uid(), value: "0", label: "New stat" }] })}
              />
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

export function CtaBlockView({
  data,
  editable,
  onChange,
}: {
  data: CtaBlock["data"];
  editable?: boolean;
  onChange?: (data: CtaBlock["data"]) => void;
}) {
  const { open } = useBooking();
  const set = (patch: Partial<CtaBlock["data"]>) => onChange?.({ ...data, ...patch });
  return (
    <section className="relative mx-auto max-w-5xl px-5 py-20 text-center md:px-8">
      <Reveal>
        <SectionTag>{editable ? <EditableText value={data.tag} onChange={(v) => set({ tag: v })} /> : data.tag}</SectionTag>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98] tracking-tight text-cream">
          {editable ? <EditableText value={data.heading1} onChange={(v) => set({ heading1: v })} /> : data.heading1}{" "}
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
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-mist">
          {editable ? (
            <EditableText as="span" multiline value={data.paragraph} onChange={(v) => set({ paragraph: v })} />
          ) : (
            data.paragraph
          )}
        </p>
      </Reveal>
      <Reveal delay={0.24}>
        <button
          onClick={() => !editable && open()}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-cream px-9 py-4 text-[15px] font-semibold text-ink transition-all hover:bg-rose hover:shadow-[0_0_44px_rgba(238,169,196,0.45)]"
        >
          {editable ? <EditableText value={data.buttonText} onChange={(v) => set({ buttonText: v })} /> : data.buttonText}
          <ArrowUpRight size={17} className="transition-transform group-hover:rotate-45" />
        </button>
      </Reveal>
    </section>
  );
}

export function SpacerBlockView({
  data,
  editable,
  onChange,
}: {
  data: SpacerBlock["data"];
  editable?: boolean;
  onChange?: (data: SpacerBlock["data"]) => void;
}) {
  if (!editable) return <div style={{ height: `${data.heightPx}px` }} aria-hidden />;
  const set = (patch: Partial<SpacerBlock["data"]>) => onChange?.({ ...data, ...patch });
  return (
    <div
      style={{ height: `${data.heightPx}px` }}
      className="relative flex items-center justify-center border-y border-dashed hairline"
    >
      <div
        data-editor-ui="true"
        className="flex items-center gap-2 rounded-full border hairline bg-ink-2/95 px-2 py-1 opacity-0 shadow-lg transition-opacity group-hover/canvas:opacity-100"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            set({ heightPx: Math.max(8, data.heightPx - 20) });
          }}
          className="grid h-5 w-5 place-items-center rounded-full text-mist hover:text-cream"
        >
          −
        </button>
        <span className="text-[11px] text-mist">{data.heightPx}px</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            set({ heightPx: Math.min(400, data.heightPx + 20) });
          }}
          className="grid h-5 w-5 place-items-center rounded-full text-mist hover:text-cream"
        >
          +
        </button>
      </div>
    </div>
  );
}
