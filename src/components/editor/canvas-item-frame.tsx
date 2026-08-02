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
  // Clicks land on the real content (text becomes editable, images open their
  // swap popover, etc.) via elements marked data-editable/data-editor-ui.
  // Anything else — real links, the "Book a session" button, nav toggles —
  // gets neutralized here so the editor never accidentally navigates or pops
  // open the booking modal while you're just trying to select a block.
  const onClickCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isEditable = target.closest('[data-editable="true"]');
    const isEditorUi = target.closest('[data-editor-ui="true"]');
    onSelect();
    if (!isEditable && !isEditorUi) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="group/canvas relative" onClickCapture={onClickCapture}>
      {/* Selection / hover outline */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 rounded-sm ring-inset transition-all ${
          selected ? "ring-2 ring-rose" : "ring-1 ring-transparent group-hover/canvas:ring-rose/40"
        }`}
      />

      {/* Real rendered content, directly interactive for editable fields */}
      <div className={hidden ? "opacity-40" : ""}>{children}</div>

      {/* Floating toolbar */}
      <div
        data-editor-ui="true"
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
