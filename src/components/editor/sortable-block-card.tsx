"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Copy, Trash2, Eye, EyeOff, Lock } from "lucide-react";
import type { Block } from "@/lib/blocks/types";
import { BLOCK_LIBRARY } from "@/lib/blocks/types";

function summarize(block: Block): string {
  switch (block.type) {
    case "hero":
      return block.data.titleLine1 || "Hero";
    case "about":
      return block.data.heading1 || "About";
    case "richtext":
      return block.data.heading || "Rich text";
    case "imageBanner":
      return block.data.caption || "Image banner";
    case "gallery":
      return `${block.data.items.length} photo${block.data.items.length === 1 ? "" : "s"}`;
    case "testimonials":
      return `${block.data.items.length} review${block.data.items.length === 1 ? "" : "s"}`;
    case "stats":
      return `${block.data.items.length} stat${block.data.items.length === 1 ? "" : "s"}`;
    case "cta":
      return block.data.heading1 || "Call to action";
    case "spacer":
      return `${block.data.heightPx}px`;
    case "servicesLocked":
      return "Live services grid — pulled from database";
    default:
      return "";
  }
}

export function SortableBlockCard({
  block,
  selected,
  onSelect,
  onDuplicate,
  onRemove,
  onToggleHidden,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onToggleHidden: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const locked = block.type === "servicesLocked";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : block.hidden ? 0.5 : 1,
  };

  const label = BLOCK_LIBRARY.find((b) => b.type === block.type)?.label ?? block.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center gap-2 rounded-xl border px-3 py-3 transition-colors ${
        selected ? "border-rose/50 bg-rose/10" : "border hairline bg-ink-2 hover:border-cream/20"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded p-1 text-mist active:cursor-grabbing"
        aria-label="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={15} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-cream">
          {label}
          {locked && <Lock size={11} className="text-gold" />}
        </p>
        <p className="truncate text-[11.5px] text-mist">{summarize(block)}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleHidden();
          }}
          className="rounded p-1.5 text-mist hover:text-cream"
          aria-label={block.hidden ? "Show block" : "Hide block"}
        >
          {block.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        {!locked && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="rounded p-1.5 text-mist hover:text-cream"
            aria-label="Duplicate block"
          >
            <Copy size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded p-1.5 text-mist hover:text-red-300"
          aria-label="Remove block"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
