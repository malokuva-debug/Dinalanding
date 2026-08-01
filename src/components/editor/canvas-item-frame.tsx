"use client";

import type { ReactNode } from "react";
import { ChevronUp, ChevronDown, Copy, Eye, EyeOff, Trash2, Lock } from "lucide-react";

export function CanvasItemFrame({
  label,
  locked,
  hidden,
  selected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onToggleHidden,
  children,
}: {
  label: string;
  locked?: boolean;
  hidden?: boolean;
  selected: boolean;
  onSelect: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onToggleHidden?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="group/canvas relative">
      {/* Selection / hover outline */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 rounded-sm ring-inset transition-all ${
          selected
            ? "ring-2 ring-rose"
            : "ring-1 ring-transparent group-hover/canvas:ring-rose/40"
        }`}
      />

      {/* Click-to-select capture layer — sits above the real content so buttons,
          links, and hover-driven animations inside the block don't fire while
          you're clicking around to select/edit it. */}
      <button
        type="button"
        onClick={onSelect}
        className="absolute inset-0 z-10 block w-full cursor-pointer"
        style={{ background: "transparent" }}
        aria-label={`Select ${label} block`}
      />

      {/* Real rendered content underneath, dimmed slightly when hidden */}
      <div className={hidden ? "opacity-40" : ""}>{children}</div>

      {/* Floating toolbar */}
      <div
        className={`pointer-events-none absolute right-2 top-2 z-20 flex items-center gap-1 rounded-lg border hairline bg-ink-2/95 px-1.5 py-1 opacity-0 shadow-lg backdrop-blur transition-opacity group-hover/canvas:opacity-100 ${
          selected ? "opacity-100" : ""
        }`}
      >
        <span className="pointer-events-none mr-1 flex items-center gap-1 pl-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-mist">
          {locked && <Lock size={10} className="text-gold" />}
          {label}
        </span>
        {onMoveUp && (
          <button type="button" onClick={onMoveUp} className="pointer-events-auto rounded p-1 text-mist hover:text-cream" aria-label="Move up">
            <ChevronUp size={13} />
          </button>
        )}
        {onMoveDown && (
          <button type="button" onClick={onMoveDown} className="pointer-events-auto rounded p-1 text-mist hover:text-cream" aria-label="Move down">
            <ChevronDown size={13} />
          </button>
        )}
        {onToggleHidden && (
          <button type="button" onClick={onToggleHidden} className="pointer-events-auto rounded p-1 text-mist hover:text-cream" aria-label="Toggle visibility">
            {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
        {onDuplicate && !locked && (
          <button type="button" onClick={onDuplicate} className="pointer-events-auto rounded p-1 text-mist hover:text-cream" aria-label="Duplicate">
            <Copy size={13} />
          </button>
        )}
        {onRemove && (
          <button type="button" onClick={onRemove} className="pointer-events-auto rounded p-1 text-mist hover:text-red-300" aria-label="Remove">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
