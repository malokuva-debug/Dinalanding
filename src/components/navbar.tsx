"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/components/booking-context";
import type { SiteSettings } from "@/lib/blocks/types";

const DEFAULT_LINKS = [
  { id: "l1", href: "#studio", label: "Studio" },
  { id: "l2", href: "#services", label: "Services" },
  { id: "l3", href: "#work", label: "Work" },
  { id: "l4", href: "#reviews", label: "Reviews" },
];

export function Navbar({ settings }: { settings?: SiteSettings["navbar"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useBooking();

  const logoText = settings?.logoText ?? "DINA";
  const logoSuperscript = settings?.logoSuperscript ?? "®";
  const tagline = settings?.tagline ?? "Nail Atelier";
  const LINKS = settings?.links ?? DEFAULT_LINKS;
  const bookButtonText = settings?.bookButtonText ?? "Book a session";

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
          <a href="#top" className="group flex items-baseline gap-2">
            <span className="font-display text-[26px] leading-none tracking-wide text-cream">
              {logoText}<span className="align-super text-[11px] text-rose">{logoSuperscript}</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.34em] text-mist sm:block">
              {tagline}
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={l.href}
                className="text-[13px] font-medium tracking-wide text-mist transition-colors hover:text-cream"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => open()}
              className="hidden rounded-full bg-cream px-5 py-2.5 text-[13px] font-semibold text-ink transition-all hover:bg-rose hover:shadow-[0_0_28px_rgba(238,169,196,0.35)] sm:block"
            >
              {bookButtonText}
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
                {bookButtonText}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
