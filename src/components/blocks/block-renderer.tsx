"use client";

import type { Block } from "@/lib/blocks/types";
import { HeroBlockView } from "@/components/blocks/hero-block";
import { AboutBlockView } from "@/components/blocks/about-block";
import { GalleryBlockView } from "@/components/blocks/gallery-block";
import { TestimonialsBlockView } from "@/components/blocks/testimonials-block";
import { RichTextBlockView, ImageBannerBlockView, StatsBlockView, CtaBlockView, SpacerBlockView } from "@/components/blocks/misc-blocks";
import { ServicesSection } from "@/components/services-section";

// Renders a single block. Shared by the public site (BlockRenderer below)
// and the editor's live canvas, so the editor always shows the exact same
// markup/styling that visitors see — no separate "preview" component to
// drift out of sync. When `editable` is true and `onChange` is provided,
// text/images/lists become directly editable in place.
export function renderBlockView(block: Block, opts?: { editable?: boolean; onChange?: (next: Block) => void }) {
  const editable = opts?.editable;
  const emit = (data: unknown) => opts?.onChange?.({ ...block, data } as Block);

  switch (block.type) {
    case "hero":
      return <HeroBlockView data={block.data} editable={editable} onChange={emit} />;
    case "about":
      return <AboutBlockView data={block.data} editable={editable} onChange={emit} />;
    case "gallery":
      return <GalleryBlockView data={block.data} editable={editable} onChange={emit} />;
    case "testimonials":
      return <TestimonialsBlockView data={block.data} editable={editable} onChange={emit} />;
    case "richtext":
      return <RichTextBlockView data={block.data} editable={editable} onChange={emit} />;
    case "imageBanner":
      return <ImageBannerBlockView data={block.data} editable={editable} onChange={emit} />;
    case "stats":
      return <StatsBlockView data={block.data} editable={editable} onChange={emit} />;
    case "cta":
      return <CtaBlockView data={block.data} editable={editable} onChange={emit} />;
    case "spacer":
      return <SpacerBlockView data={block.data} editable={editable} onChange={emit} />;
    case "servicesLocked":
      // Always renders the real, database-backed services grid —
      // untouched by the editor, only its position in the page changes.
      return <ServicesSection />;
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => {
        if (block.hidden) return null;
        return <div key={block.id}>{renderBlockView(block)}</div>;
      })}
    </>
  );
}
