"use client";

import type { ThemeColors } from "@/lib/blocks/types";

const SWATCHES: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: "ink", label: "Background", hint: "Main page background" },
  { key: "ink2", label: "Background (panels)", hint: "Cards, footer, testimonials strip" },
  { key: "cream", label: "Text", hint: "Headings & body text" },
  { key: "rose", label: "Accent (primary)", hint: "Buttons, links, highlights" },
  { key: "gold", label: "Accent (secondary)", hint: "Stars, badges, glows" },
  { key: "mist", label: "Muted text", hint: "Secondary/supporting text" },
];

export function GlobalStylePanel({
  theme,
  onChange,
}: {
  theme: ThemeColors;
  onChange: (next: ThemeColors) => void;
}) {
  const set = (key: keyof ThemeColors, value: string) => onChange({ ...theme, [key]: value });

  return (
    <div className="space-y-1">
      <p className="mb-3 text-[12px] leading-relaxed text-mist">
        These colors apply site-wide and update the canvas instantly. They&apos;re part of your
        draft, so they only go live when you Publish.
      </p>
      {SWATCHES.map((s) => (
        <div key={s.key} className="flex items-center gap-3 rounded-xl border hairline bg-ink px-3 py-2.5">
          <label className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border hairline">
            <input
              type="color"
              value={theme[s.key]}
              onChange={(e) => set(s.key, e.target.value)}
              className="absolute inset-0 h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 p-0"
            />
          </label>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-medium text-cream">{s.label}</p>
            <p className="truncate text-[10.5px] text-mist/70">{s.hint}</p>
          </div>
          <input
            type="text"
            value={theme[s.key]}
            onChange={(e) => set(s.key, e.target.value)}
            className="w-20 shrink-0 rounded-md border hairline bg-ink-2 px-1.5 py-1 text-[11px] text-cream outline-none focus:border-rose/50"
          />
        </div>
      ))}
    </div>
  );
}
