import type { SiteContent } from "./types";

export const CONTENT_ID = "homepage";

export const DEFAULT_CONTENT: SiteContent = {
  blocks: [
    {
      id: "hero-1",
      type: "hero",
      data: {
        eyebrowLeft: "Est. 2026",
        eyebrowRight: "Studio · By appointment",
        titleLine1: "The Bright",
        titleLine2Emphasis: "Beauty.",
        paragraph:
          "Sculpted gel, chrome finishes and hand-painted art — a one-artist atelier founded by Dina, built on creativity, style and obsessive precision.",
        primaryButtonText: "Book a session",
        secondaryButtonText: "Explore services",
        secondaryButtonHref: "#services",
        image: "/gallery/nail-06.jpg",
        imageAlt: "Sculpted gel nails by Dina",
        badgeTitle: "Next slot today",
        badgeSubtitle: "14:30 · Gel manicure",
        stats: [
          { id: "s1", value: "1.2k+", label: "Sets completed" },
          { id: "s2", value: "60+", label: "Signature designs" },
          { id: "s3", value: "4.9★", label: "Average rating" },
        ],
        marqueeItems: [
          "Gel Manicure",
          "BIAB Builder",
          "Chrome Finish",
          "Hand-painted Art",
          "Gel Extensions",
          "Luxury Pedicure",
          "French Tips",
          "3D Accents",
        ],
      },
    },
    {
      id: "about-1",
      type: "about",
      data: {
        tag: "About the studio",
        heading1: "Born from creativity,",
        heading2: "built on",
        headingEmphasis: "precision.",
        paragraph1:
          "DINA Nail Atelier is a dynamic, one-artist studio committed to beautiful, professional results. Every appointment is a private session — your nails, your design, and an artist who treats each set like a signature piece.",
        paragraph2:
          "From sculpted gel extensions to hand-painted micro-art, the studio pairs hospital-grade hygiene with a meticulous, slow-craft approach. No rushed sets. No compromises.",
        image: "/gallery/nail-08.jpg",
        imageAlt: "Dina at work in the studio",
        badgeName: "Dina",
        badgeRole: "Founder & lead artist",
        stats: [
          { id: "a1", value: "6+", label: "Years of artistry" },
          { id: "a2", value: "1.2k+", label: "Sets delivered" },
          { id: "a3", value: "100%", label: "Sterile, single-use kits" },
          { id: "a4", value: "3wk", label: "Average gel wear" },
        ],
      },
    },
    {
      id: "services-locked-1",
      type: "servicesLocked",
      data: {},
    },
    {
      id: "gallery-1",
      type: "gallery",
      data: {
        tag: "Portfolio",
        heading1: "Work with",
        heading2: "",
        headingEmphasis: "pure precision.",
        paragraph:
          "A selection from the studio — every set photographed before it leaves the chair.",
        items: [
          { id: "g1", src: "/gallery/nail-03.jpg", label: "Chromed-out almond" },
          { id: "g2", src: "/gallery/nail-04.jpg", label: "Bare-glam BIAB" },
          { id: "g3", src: "/gallery/nail-05.jpg", label: "Sculpted medium almond" },
          { id: "g4", src: "/gallery/nail-07.jpg", label: "Soft ivory set" },
          { id: "g5", src: "/gallery/nail-09.jpg", label: "Spa-fresh toes" },
          { id: "g6", src: "/gallery/nail-10.jpg", label: "Glossy nude sculpt" },
          { id: "g7", src: "/gallery/nail-11.jpg", label: "Hand-painted detail" },
          { id: "g8", src: "/gallery/nail-02.jpg", label: "Cherry chrome" },
          { id: "g9", src: "/gallery/nail-01.jpg", label: "Studio favourite" },
        ],
      },
    },
    {
      id: "testimonials-1",
      type: "testimonials",
      data: {
        tag: "Testimonials",
        heading1: "Word on",
        heading2: "",
        headingEmphasis: "the street.",
        paragraph: "Real reviews from the chair. Verified sessions, unfiltered words.",
        items: [
          {
            id: "t1",
            quote:
              "I've never had a set last three weeks without a single chip. Dina's gel work is on another level — precise, clean, and genuinely artistic.",
            name: "Mara L.",
            service: "BIAB · Builder Gel",
            featured: true,
          },
          {
            id: "t2",
            quote:
              "The chrome almond set got me stopped twice in one day. Booking online took me under a minute — exactly how it should work.",
            name: "Elena R.",
            service: "Gel Extensions",
          },
          {
            id: "t3",
            quote:
              "Finally a studio that treats hygiene like a hospital and nails like art. The hand-painted florals were unreal.",
            name: "Sofia K.",
            service: "Nail Art Session",
          },
          {
            id: "t4",
            quote:
              "Quiet, calm, spotless. Dina re-did a set another salon ruined and I left feeling like a new person.",
            name: "Nadia P.",
            service: "Acrylic Full Set",
          },
        ],
      },
    },
  ],
  settings: {
    theme: {
      ink: "#0a090d",
      ink2: "#12101a",
      cream: "#f3efe8",
      rose: "#eea9c4",
      gold: "#dfc08f",
      mist: "#a49caa",
    },
    navbar: {
      logoText: "DINA",
      logoSuperscript: "®",
      tagline: "Nail Atelier",
      links: [
        { id: "l1", href: "#studio", label: "Studio" },
        { id: "l2", href: "#services", label: "Services" },
        { id: "l3", href: "#work", label: "Work" },
        { id: "l4", href: "#reviews", label: "Reviews" },
      ],
      bookButtonText: "Book a session",
    },
    footer: {
      tag: "Collaborate with us",
      heading1: "Your nails,",
      headingEmphasis: "our obsession.",
      paragraph:
        "Sessions are limited to keep every set flawless. Book online — or reach out for bridal parties and custom commissions.",
      buttonText: "Book a session",
      brandName: "DINA",
      brandBlurb:
        "Nail Atelier · The Bright Beauty. Sculpted gel, chrome and hand-painted art, by appointment only.",
      address: "12 Rosewood Lane, Suite 3 — Downtown",
      hoursLine1: "Tue – Sat · 9:00 — 18:00",
      hoursLine2: "Sundays by request",
      email: "hello@dinanails.studio",
      phone: "+15550001234",
      instagramHandle: "@dina.nails",
      instagramUrl: "https://instagram.com",
      copyrightText: "© 2026 DINA Nail Atelier. All rights reserved.",
    },
  },
};
