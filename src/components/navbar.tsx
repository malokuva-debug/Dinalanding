"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/components/booking-context";
import type { SiteSettings } from "@/lib/blocks/types";
import { EditableText } from "@/components/editor/inline/editable-text";
import { EditablePopoverText } from "@/components/editor/inline/editable-popover-text";
import { InlineAddTile, InlineRemoveButton } from "@/components/editor/inline/inline-list-controls";

const DEFAULT_LINKS = [
  { id: "l1", href: "#studio", label: "Studio" },
  { id: "l2", href: "#services", label: "Services" },
  { id: "l3", href: "#work", label: "Work" },
  { id: "l4", href: "#reviews", label: "Reviews" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function Navbar({
  settings,
  editable,
  onChange,
}: {
  settings?: SiteSettings["navbar"];
  editable?: boolean;
  onChange?: (next: SiteSettings["navbar"]) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useBooking();

  const nav = settings ?? {
    logoText: "DINA",
    logoSuperscript: "®",
    tagline: "Nail Atelier",
    links: DEFAULT_LINKS,
    bookButtonText: "Book a session",
  };
  const set = (patch: Partial<SiteSettings["navbar"]>) => onChange?.({ ...nav, ...patch });
  const LINKS = nav.links;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b hairline bg-ink/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <a href={editable ? undefined : "#top"} className="group flex items-baseline gap-2">
            <span className="font-display text-[26px] leading-none tracking-wide text-cream">
              {editable ? <EditableText value={nav.logoText} onChange={(v) => set({ logoText: v })} /> : nav.logoText}
              <span className="align-super text-[11px] text-rose">
                {editable ? (
                  <EditableText value={nav.logoSuperscript} onChange={(v) => set({ logoSuperscript: v })} />
                ) : (
                  nav.logoSuperscript
                )}
              </span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.34em] text-mist sm:block">
              {editable ? <EditableText value={nav.tagline} onChange={(v) => set({ tagline: v })} /> : nav.tagline}
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <span key={l.id} className="group/item relative flex items-center gap-1">
                <a
                  href={editable ? undefined : l.href}
                  className="text-[13px] font-medium tracking-wide text-mist transition-colors hover:text-cream"
                >
                  {editable ? (
                    <EditableText
                      value={l.label}
                      onChange={(v) => set({ links: LINKS.map((x) => (x.id === l.id ? { ...x, label: v } : x)) })}
                    />
                  ) : (
                    l.label
                  )}
                </a>
                {editable && (
                  <>
                    <EditablePopoverText
                      label="Link URL"
                      value={l.href}
                      placeholder="#section or https://…"
                      onChange={(v) => set({ links: LINKS.map((x) => (x.id === l.id ? { ...x, href: v } : x)) })}
                    />
                    <InlineRemoveButton
                      label="Remove link"
                      onRemove={() => set({ links: LINKS.filter((x) => x.id !== l.id) })}
                    />
                  </>
                )}
              </span>
            ))}
            {editable && (
              <InlineAddTile
                label="Link"
                className="h-7 px-2.5"
                onAdd={() => set({ links: [...LINKS, { id: uid(), href: "#section", label: "New link" }] })}
              />
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => !editable && open()}
              className="hidden rounded-full bg-cream px-5 py-2.5 text-[13px] font-semibold text-ink transition-all hover:bg-rose hover:shadow-[0_0_28px_rgba(238,169,196,0.35)] sm:block"
            >
              {editable ? (
                <EditableText value={nav.bookButtonText} onChange={(v) => set({ bookButtonText: v })} />
              ) : (
                nav.bookButtonText
              )}
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border hairline text-cream md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="font-display text-4xl text-cream"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setMobileOpen(false);
                  open();
                }}
                className="mt-4 rounded-full bg-rose px-8 py-3.5 text-sm font-semibold text-ink"
              >
                {nav.bookButtonText}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
