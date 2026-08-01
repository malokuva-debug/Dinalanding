"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border hairline bg-ink px-3 py-2 text-[13.5px] text-cream outline-none focus:border-rose/50"
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border hairline bg-ink px-3 py-2 text-[13.5px] leading-relaxed text-cream outline-none focus:border-rose/50"
      />
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border hairline bg-ink-3">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <input
          type="text"
          value={value}
          placeholder="/gallery/your-image.jpg or https://…"
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border hairline bg-ink px-3 py-2 text-[13px] text-cream outline-none focus:border-rose/50"
        />
      </div>
      <p className="mt-1.5 text-[11px] text-mist/70">
        Paste an image URL, or upload the file to your project&apos;s <code>/public</code> folder
        and reference it like <code>/gallery/new-photo.jpg</code>.
      </p>
    </div>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border hairline bg-ink px-3 py-2 text-[13.5px] text-cream outline-none focus:border-rose/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-2">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border hairline bg-ink px-3 py-2 text-[13.5px] text-cream outline-none focus:border-rose/50"
      />
    </div>
  );
}

// Generic editor for arrays of objects with an `id` field (stats, gallery items, testimonials…).
export function ListEditor<T extends { id: string }>({
  label,
  items,
  onChange,
  makeNew,
  renderItem,
  itemSummary,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  makeNew: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  itemSummary?: (item: T) => string;
}) {
  const update = (id: string, patch: Partial<T>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));
  const add = () => onChange([...items, makeNew()]);
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <button
          onClick={add}
          type="button"
          className="flex items-center gap-1 rounded-full border hairline px-2.5 py-1 text-[11px] font-medium text-mist transition-colors hover:border-rose/40 hover:text-rose"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={item.id} className="rounded-lg border hairline bg-ink px-3 py-2.5" open={items.length <= 2}>
            <summary className="flex cursor-pointer items-center justify-between text-[12.5px] text-cream/90">
              <span className="truncate pr-2">{itemSummary ? itemSummary(item) : `Item ${i + 1}`}</span>
              <span className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    move(i, -1);
                  }}
                  className="rounded p-1 text-mist hover:text-cream"
                  aria-label="Move up"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    move(i, 1);
                  }}
                  className="rounded p-1 text-mist hover:text-cream"
                  aria-label="Move down"
                >
                  <ChevronDown size={13} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    remove(item.id);
                  }}
                  className="rounded p-1 text-mist hover:text-red-300"
                  aria-label="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </span>
            </summary>
            <div className="mt-3">{renderItem(item, (patch) => update(item.id, patch))}</div>
          </details>
        ))}
        {items.length === 0 && <p className="text-[12px] text-mist/60">Nothing here yet — click Add.</p>}
      </div>
    </div>
  );
}

// Simple editor for arrays of plain strings (e.g. marquee items).
export function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <button
          type="button"
          onClick={() => onChange([...items, "New item"])}
          className="flex items-center gap-1 rounded-full border hairline px-2.5 py-1 text-[11px] font-medium text-mist transition-colors hover:border-rose/40 hover:text-rose"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={val}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="w-full rounded-lg border hairline bg-ink px-3 py-2 text-[13px] text-cream outline-none focus:border-rose/50"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="shrink-0 rounded p-1.5 text-mist hover:text-red-300"
              aria-label="Remove"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
