"use client";

import { BookingProvider } from "@/components/booking-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { renderBlockView } from "@/components/blocks/block-renderer";
import { BLOCK_LIBRARY, type SiteContent } from "@/lib/blocks/types";
import { CanvasItemFrame } from "@/components/editor/canvas-item-frame";

export type Selection = { kind: "block"; id: string } | { kind: "navbar" } | { kind: "footer" } | null;

export function LiveCanvas({
  content,
  selection,
  onSelect,
  onMoveBlock,
  onDuplicateBlock,
  onRemoveBlock,
  onToggleHiddenBlock,
}: {
  content: SiteContent;
  selection: Selection;
  onSelect: (s: Selection) => void;
  onMoveBlock: (id: string, dir: -1 | 1) => void;
  onDuplicateBlock: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  onToggleHiddenBlock: (id: string) => void;
}) {
  return (
    // The transform below gives this div its own containing block for
    // `position: fixed` descendants (like the real Navbar), so the live
    // Navbar sticks to the TOP OF THE CANVAS instead of escaping to cover
    // the editor's own toolbar — no iframe needed, same real component.
    <div className="relative h-full overflow-y-auto" style={{ transform: "translateZ(0)" }}>
      <BookingProvider>
        <CanvasItemFrame
          label="Navbar"
          selected={selection?.kind === "navbar"}
          onSelect={() => onSelect({ kind: "navbar" })}
        >
          <Navbar settings={content.settings.navbar} />
          {/* spacer so page content isn't hidden under the fixed navbar */}
          <div className="h-0" />
        </CanvasItemFrame>

        <main>
          {content.blocks.map((block, i) => {
            const label = BLOCK_LIBRARY.find((b) => b.type === block.type)?.label ?? block.type;
            return (
              <CanvasItemFrame
                key={block.id}
                label={label}
                locked={block.type === "servicesLocked"}
                hidden={block.hidden}
                selected={selection?.kind === "block" && selection.id === block.id}
                onSelect={() => onSelect({ kind: "block", id: block.id })}
                onMoveUp={i > 0 ? () => onMoveBlock(block.id, -1) : undefined}
                onMoveDown={i < content.blocks.length - 1 ? () => onMoveBlock(block.id, 1) : undefined}
                onDuplicate={block.type === "servicesLocked" ? undefined : () => onDuplicateBlock(block.id)}
                onRemove={() => onRemoveBlock(block.id)}
                onToggleHidden={() => onToggleHiddenBlock(block.id)}
              >
                {block.hidden ? (
                  <div className="mx-auto max-w-7xl px-5 py-10 text-center text-[13px] text-mist md:px-8">
                    Hidden block — not shown on the live site
                  </div>
                ) : (
                  renderBlockView(block)
                )}
              </CanvasItemFrame>
            );
          })}
        </main>

        <CanvasItemFrame
          label="Footer"
          selected={selection?.kind === "footer"}
          onSelect={() => onSelect({ kind: "footer" })}
        >
          <Footer settings={content.settings.footer} />
        </CanvasItemFrame>
      </BookingProvider>
    </div>
  );
}
