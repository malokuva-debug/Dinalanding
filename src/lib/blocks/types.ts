// Content model for the visual editor.
// Everything here is plain JSON so it can be stored in Supabase (site_content table)
// and safely defaulted if that table is empty/missing — the public site never breaks.

export type ImageItem = {
  id: string;
  src: string;
  label: string;
};

export type StatItem = {
  id: string;
  value: string;
  label: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  service: string;
  featured?: boolean;
};

export type BlockType =
  | "hero"
  | "about"
  | "richtext"
  | "imageBanner"
  | "gallery"
  | "testimonials"
  | "stats"
  | "cta"
  | "spacer"
  | "servicesLocked";

export interface BaseBlock {
  id: string;
  type: BlockType;
  hidden?: boolean;
}

export interface HeroBlock extends BaseBlock {
  type: "hero";
  data: {
    eyebrowLeft: string;
    eyebrowRight: string;
    titleLine1: string;
    titleLine2Emphasis: string;
    paragraph: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    secondaryButtonHref: string;
    image: string;
    imageAlt: string;
    badgeTitle: string;
    badgeSubtitle: string;
    stats: StatItem[];
    marqueeItems: string[];
  };
}

export interface AboutBlock extends BaseBlock {
  type: "about";
  data: {
    tag: string;
    heading1: string;
    heading2: string;
    headingEmphasis: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
    imageAlt: string;
    badgeName: string;
    badgeRole: string;
    stats: StatItem[];
  };
}

export interface RichTextBlock extends BaseBlock {
  type: "richtext";
  data: {
    tag: string;
    heading: string;
    body: string;
    align: "left" | "center";
  };
}

export interface ImageBannerBlock extends BaseBlock {
  type: "imageBanner";
  data: {
    image: string;
    caption: string;
    heightClass: "short" | "medium" | "tall";
  };
}

export interface GalleryBlock extends BaseBlock {
  type: "gallery";
  data: {
    tag: string;
    heading1: string;
    heading2: string;
    headingEmphasis: string;
    paragraph: string;
    items: ImageItem[];
  };
}

export interface TestimonialsBlock extends BaseBlock {
  type: "testimonials";
  data: {
    tag: string;
    heading1: string;
    heading2: string;
    headingEmphasis: string;
    paragraph: string;
    items: TestimonialItem[];
  };
}

export interface StatsBlock extends BaseBlock {
  type: "stats";
  data: {
    items: StatItem[];
  };
}

export interface CtaBlock extends BaseBlock {
  type: "cta";
  data: {
    tag: string;
    heading1: string;
    headingEmphasis: string;
    paragraph: string;
    buttonText: string;
  };
}

export interface SpacerBlock extends BaseBlock {
  type: "spacer";
  data: {
    heightPx: number;
  };
}

export interface ServicesLockedBlock extends BaseBlock {
  type: "servicesLocked";
  data: Record<string, never>;
}

export type Block =
  | HeroBlock
  | AboutBlock
  | RichTextBlock
  | ImageBannerBlock
  | GalleryBlock
  | TestimonialsBlock
  | StatsBlock
  | CtaBlock
  | SpacerBlock
  | ServicesLockedBlock;

export type SiteSettings = {
  navbar: {
    logoText: string;
    logoSuperscript: string;
    tagline: string;
    links: { id: string; href: string; label: string }[];
    bookButtonText: string;
  };
  footer: {
    tag: string;
    heading1: string;
    headingEmphasis: string;
    paragraph: string;
    buttonText: string;
    brandName: string;
    brandBlurb: string;
    address: string;
    hoursLine1: string;
    hoursLine2: string;
    email: string;
    phone: string;
    instagramHandle: string;
    instagramUrl: string;
    copyrightText: string;
  };
};

export type SiteContent = {
  blocks: Block[];
  settings: SiteSettings;
};

export const BLOCK_LIBRARY: { type: BlockType; label: string; description: string }[] = [
  { type: "hero", label: "Hero", description: "Top banner with title, image and CTA" },
  { type: "about", label: "About split", description: "Image + text side by side" },
  { type: "richtext", label: "Rich text", description: "Heading + paragraph" },
  { type: "imageBanner", label: "Image banner", description: "Full-width image with caption" },
  { type: "gallery", label: "Gallery", description: "Grid of images" },
  { type: "testimonials", label: "Testimonials", description: "Grid of quotes" },
  { type: "stats", label: "Stat strip", description: "Row of number + label chips" },
  { type: "cta", label: "Call to action", description: "Centered heading + book button" },
  { type: "spacer", label: "Spacer", description: "Empty vertical space" },
  { type: "servicesLocked", label: "Services (locked)", description: "Your live services grid — reposition only, content comes from the database and can't be edited here" },
];
