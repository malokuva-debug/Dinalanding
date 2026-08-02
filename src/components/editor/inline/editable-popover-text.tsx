"use client";

import { useState, useRef, useEffect } from "react";
import { Link2 } from "lucide-react";

export function EditablePopoverText({
  value,
  onChange,
  label = "Link",
  placeholder = "",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const boxRef = useRef<HTMLSpanElement>(null);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <span ref={boxRef} data-editable="true" data-editor-ui="true" className="relative inline-flex" onPointerDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="rounded p-1 text-mist/70 hover:text-rose"
        aria-label={`Edit ${label.toLowerCase()}`}
        title={`Edit ${label.toLowerCase()}`}
      >
        <Link2 size={12} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-xl border hairline bg-ink-2 p-3 shadow-2xl"
        >
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-mist">{label}</p>
          <input
            autoFocus
            type="text"
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onChange(draft);
                setOpen(false);
              }
            }}
            className="w-full rounded-lg border hairline bg-ink px-2.5 py-2 text-[12.5px] text-cream outline-none focus:border-rose/50"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-full px-3 py-1.5 text-[12px] text-mist hover:text-cream">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
              className="rounded-full bg-cream px-3.5 py-1.5 text-[12px] font-semibold text-ink hover:bg-rose"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
