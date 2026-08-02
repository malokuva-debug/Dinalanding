"use client";

import { useState, useRef, useEffect } from "react";
import { ImagePlus } from "lucide-react";

export function EditableImage({
  src,
  alt,
  onChange,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  onChange: (v: string) => void;
  className?: string;
  imgClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(src);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDraft(src), [src]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div
      ref={boxRef}
      data-editable="true"
      className={`group/img relative ${className}`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={imgClassName} />

      <button
        type="button"
        data-editor-ui="true"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="absolute inset-0 z-10 grid place-items-center bg-ink/0 opacity-0 transition-all group-hover/img:bg-ink/45 group-hover/img:opacity-100"
        aria-label="Change image"
      >
        <span className="flex items-center gap-1.5 rounded-full bg-ink-2/95 px-3 py-1.5 text-[11.5px] font-medium text-cream shadow-lg">
          <ImagePlus size={13} /> Change image
        </span>
      </button>

      {open && (
        <div
          data-editor-ui="true"
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-xl border hairline bg-ink-2 p-3 shadow-2xl"
        >
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-mist">Image URL</p>
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onChange(draft);
                setOpen(false);
              }
            }}
            placeholder="/gallery/your-image.jpg or https://…"
            className="w-full rounded-lg border hairline bg-ink px-2.5 py-2 text-[12.5px] text-cream outline-none focus:border-rose/50"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-1.5 text-[12px] text-mist hover:text-cream"
            >
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
          <p className="mt-2 text-[10.5px] leading-snug text-mist/70">
            Paste an image URL, or upload the file into your project&apos;s <code>/public</code>{" "}
            folder and reference it like <code>/gallery/new-photo.jpg</code>.
          </p>
        </div>
      )}
    </div>
  );
}
