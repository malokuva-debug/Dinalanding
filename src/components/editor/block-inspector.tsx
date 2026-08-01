"use client";

import type { Block } from "@/lib/blocks/types";
import {
  TextField,
  TextAreaField,
  ImageField,
  SelectField,
  NumberField,
  ListEditor,
  StringListEditor,
} from "@/components/editor/fields";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function BlockInspector({
  block,
  onChange,
}: {
  block: Block;
  onChange: (next: Block) => void;
}) {
  switch (block.type) {
    case "hero": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return (
        <>
          <TextField label="Eyebrow (left pill)" value={d.eyebrowLeft} onChange={(v) => set({ eyebrowLeft: v })} />
          <TextField label="Eyebrow (right text)" value={d.eyebrowRight} onChange={(v) => set({ eyebrowRight: v })} />
          <TextField label="Title — line 1" value={d.titleLine1} onChange={(v) => set({ titleLine1: v })} />
          <TextField label="Title — line 2 (emphasis)" value={d.titleLine2Emphasis} onChange={(v) => set({ titleLine2Emphasis: v })} />
          <TextAreaField label="Paragraph" value={d.paragraph} onChange={(v) => set({ paragraph: v })} />
          <TextField label="Primary button text" value={d.primaryButtonText} onChange={(v) => set({ primaryButtonText: v })} />
          <TextField label="Secondary button text" value={d.secondaryButtonText} onChange={(v) => set({ secondaryButtonText: v })} />
          <TextField label="Secondary button link" value={d.secondaryButtonHref} onChange={(v) => set({ secondaryButtonHref: v })} />
          <ImageField label="Hero image" value={d.image} onChange={(v) => set({ image: v })} />
          <TextField label="Image alt text" value={d.imageAlt} onChange={(v) => set({ imageAlt: v })} />
          <TextField label="Floating badge title" value={d.badgeTitle} onChange={(v) => set({ badgeTitle: v })} />
          <TextField label="Floating badge subtitle" value={d.badgeSubtitle} onChange={(v) => set({ badgeSubtitle: v })} />
          <ListEditor
            label="Stats"
            items={d.stats}
            onChange={(stats) => set({ stats })}
            makeNew={() => ({ id: uid(), value: "0", label: "New stat" })}
            itemSummary={(it) => `${it.value} — ${it.label}`}
            renderItem={(it, update) => (
              <>
                <TextField label="Value" value={it.value} onChange={(v) => update({ value: v })} />
                <TextField label="Label" value={it.label} onChange={(v) => update({ label: v })} />
              </>
            )}
          />
          <StringListEditor label="Scrolling marquee items" items={d.marqueeItems} onChange={(marqueeItems) => set({ marqueeItems })} />
        </>
      );
    }
    case "about": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return (
        <>
          <TextField label="Section tag" value={d.tag} onChange={(v) => set({ tag: v })} />
          <TextField label="Heading — line 1" value={d.heading1} onChange={(v) => set({ heading1: v })} />
          <TextField label="Heading — line 2" value={d.heading2} onChange={(v) => set({ heading2: v })} />
          <TextField label="Heading emphasis" value={d.headingEmphasis} onChange={(v) => set({ headingEmphasis: v })} />
          <TextAreaField label="Paragraph 1" value={d.paragraph1} onChange={(v) => set({ paragraph1: v })} />
          <TextAreaField label="Paragraph 2" value={d.paragraph2} onChange={(v) => set({ paragraph2: v })} />
          <ImageField label="Image" value={d.image} onChange={(v) => set({ image: v })} />
          <TextField label="Image alt text" value={d.imageAlt} onChange={(v) => set({ imageAlt: v })} />
          <TextField label="Badge name" value={d.badgeName} onChange={(v) => set({ badgeName: v })} />
          <TextField label="Badge role" value={d.badgeRole} onChange={(v) => set({ badgeRole: v })} />
          <ListEditor
            label="Stats"
            items={d.stats}
            onChange={(stats) => set({ stats })}
            makeNew={() => ({ id: uid(), value: "0", label: "New stat" })}
            itemSummary={(it) => `${it.value} — ${it.label}`}
            renderItem={(it, update) => (
              <>
                <TextField label="Value" value={it.value} onChange={(v) => update({ value: v })} />
                <TextField label="Label" value={it.label} onChange={(v) => update({ label: v })} />
              </>
            )}
          />
        </>
      );
    }
    case "richtext": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return (
        <>
          <TextField label="Section tag" value={d.tag} onChange={(v) => set({ tag: v })} />
          <TextField label="Heading" value={d.heading} onChange={(v) => set({ heading: v })} />
          <TextAreaField label="Body" value={d.body} onChange={(v) => set({ body: v })} rows={6} />
          <SelectField
            label="Alignment"
            value={d.align}
            onChange={(v) => set({ align: v as "left" | "center" })}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
            ]}
          />
        </>
      );
    }
    case "imageBanner": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return (
        <>
          <ImageField label="Image" value={d.image} onChange={(v) => set({ image: v })} />
          <TextField label="Caption" value={d.caption} onChange={(v) => set({ caption: v })} />
          <SelectField
            label="Height"
            value={d.heightClass}
            onChange={(v) => set({ heightClass: v as "short" | "medium" | "tall" })}
            options={[
              { value: "short", label: "Short" },
              { value: "medium", label: "Medium" },
              { value: "tall", label: "Tall" },
            ]}
          />
        </>
      );
    }
    case "gallery": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return (
        <>
          <TextField label="Section tag" value={d.tag} onChange={(v) => set({ tag: v })} />
          <TextField label="Heading — line 1" value={d.heading1} onChange={(v) => set({ heading1: v })} />
          <TextField label="Heading — line 2" value={d.heading2} onChange={(v) => set({ heading2: v })} />
          <TextField label="Heading emphasis" value={d.headingEmphasis} onChange={(v) => set({ headingEmphasis: v })} />
          <TextAreaField label="Paragraph" value={d.paragraph} onChange={(v) => set({ paragraph: v })} />
          <ListEditor
            label="Photos"
            items={d.items}
            onChange={(items) => set({ items })}
            makeNew={() => ({ id: uid(), src: "/gallery/nail-01.jpg", label: "New photo" })}
            itemSummary={(it) => it.label || it.src}
            renderItem={(it, update) => (
              <>
                <ImageField label="Image" value={it.src} onChange={(v) => update({ src: v })} />
                <TextField label="Caption" value={it.label} onChange={(v) => update({ label: v })} />
              </>
            )}
          />
        </>
      );
    }
    case "testimonials": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return (
        <>
          <TextField label="Section tag" value={d.tag} onChange={(v) => set({ tag: v })} />
          <TextField label="Heading — line 1" value={d.heading1} onChange={(v) => set({ heading1: v })} />
          <TextField label="Heading — line 2" value={d.heading2} onChange={(v) => set({ heading2: v })} />
          <TextField label="Heading emphasis" value={d.headingEmphasis} onChange={(v) => set({ headingEmphasis: v })} />
          <TextAreaField label="Paragraph" value={d.paragraph} onChange={(v) => set({ paragraph: v })} />
          <ListEditor
            label="Reviews"
            items={d.items}
            onChange={(items) => set({ items })}
            makeNew={() => ({ id: uid(), quote: "New review text", name: "Client name", service: "Service", featured: false })}
            itemSummary={(it) => `${it.name} — ${it.service}`}
            renderItem={(it, update) => (
              <>
                <TextAreaField label="Quote" value={it.quote} onChange={(v) => update({ quote: v })} />
                <TextField label="Name" value={it.name} onChange={(v) => update({ name: v })} />
                <TextField label="Service" value={it.service} onChange={(v) => update({ service: v })} />
                <label className="mb-4 flex items-center gap-2 text-[12.5px] text-mist">
                  <input
                    type="checkbox"
                    checked={!!it.featured}
                    onChange={(e) => update({ featured: e.target.checked })}
                  />
                  Featured (larger card)
                </label>
              </>
            )}
          />
        </>
      );
    }
    case "stats": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return (
        <ListEditor
          label="Stats"
          items={d.items}
          onChange={(items) => set({ items })}
          makeNew={() => ({ id: uid(), value: "0", label: "New stat" })}
          itemSummary={(it) => `${it.value} — ${it.label}`}
          renderItem={(it, update) => (
            <>
              <TextField label="Value" value={it.value} onChange={(v) => update({ value: v })} />
              <TextField label="Label" value={it.label} onChange={(v) => update({ label: v })} />
            </>
          )}
        />
      );
    }
    case "cta": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return (
        <>
          <TextField label="Section tag" value={d.tag} onChange={(v) => set({ tag: v })} />
          <TextField label="Heading" value={d.heading1} onChange={(v) => set({ heading1: v })} />
          <TextField label="Heading emphasis" value={d.headingEmphasis} onChange={(v) => set({ headingEmphasis: v })} />
          <TextAreaField label="Paragraph" value={d.paragraph} onChange={(v) => set({ paragraph: v })} />
          <TextField label="Button text" value={d.buttonText} onChange={(v) => set({ buttonText: v })} />
        </>
      );
    }
    case "spacer": {
      const d = block.data;
      const set = (patch: Partial<typeof d>) => onChange({ ...block, data: { ...d, ...patch } });
      return <NumberField label="Height (px)" value={d.heightPx} min={8} max={400} onChange={(v) => set({ heightPx: v })} />;
    }
    case "servicesLocked":
      return (
        <p className="rounded-lg border border-gold/25 bg-gold/10 px-3 py-3 text-[12.5px] leading-relaxed text-gold">
          This block always renders your live services grid, pulled from your services database.
          Its content, pricing and behavior can&apos;t be changed here — manage services from your
          normal admin/database tools. You can still drag this block to reposition it on the page.
        </p>
      );
    default:
      return null;
  }
}
