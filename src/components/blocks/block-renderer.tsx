"use client";

import type { Block } from "@/lib/blocks/types";
import { HeroBlockView } from "@/components/blocks/hero-block";
import { AboutBlockView } from "@/components/blocks/about-block";
import { GalleryBlockView } from "@/components/blocks/gallery-block";
import { TestimonialsBlockView } from "@/components/blocks/testimonials-block";
import { RichTextBlockView, ImageBannerBlockView, StatsBlockView, CtaBlockView, SpacerBlockView } from "@/components/blocks/misc-blocks";
import { ServicesSection } from "@/components/services-section";

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => {
        if (block.hidden) return null;
        switch (block.type) {
          case "hero":
            return <HeroBlockView key={block.id} data={block.data} />;
          case "about":
            return <AboutBlockView key={block.id} data={block.data} />;
          case "gallery":
            return <GalleryBlockView key={block.id} data={block.data} />;
          case "testimonials":
            return <TestimonialsBlockView key={block.id} data={block.data} />;
          case "richtext":
            return <RichTextBlockView key={block.id} data={block.data} />;
          case "imageBanner":
            return <ImageBannerBlockView key={block.id} data={block.data} />;
          case "stats":
            return <StatsBlockView key={block.id} data={block.data} />;
          case "cta":
            return <CtaBlockView key={block.id} data={block.data} />;
          case "spacer":
            return <SpacerBlockView key={block.id} data={block.data} />;
          case "servicesLocked":
            // Always renders the real, database-backed services grid —
            // untouched by the editor, only its position in the page changes.
            return <ServicesSection key={block.id} />;
          default:
            return null;
        }
      })}
    </>
  );
}
