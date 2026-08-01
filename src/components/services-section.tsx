"use client";

import { ArrowUpRight, Clock3 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Reveal, SectionTag } from "@/components/reveal";
import { useBooking } from "@/components/booking-context";

type DbService = {
  id: string;
  name: string;
  price: string;
  duration: number;
  category_id: string | null;
  categories?: { name: string | null };
};

export function ServicesSection() {
  const { open } = useBooking();
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services", { next: { revalidate: 0 } });
      if (!res.ok) {
        setError(true);
        setServices([]);
        return;
      }
      const json = await res.json();
      setServices(json.services ?? []);
    } catch {
      setError(true);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading) {
    return (
      <section id="services" className="border-t hairline bg-ink-2/40 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex animate-pulse flex-col gap-6">
            <div className="h-6 w-36 rounded-full bg-cream/8" />
            <div className="h-20 w-80 rounded-2xl bg-cream/6" />
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-cream/4" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no services available (empty DB or no connection), hide the entire section
  if (services.length === 0 || error) return null;

  return (
    <section id="services" className="relative border-t hairline bg-ink-2/40 py-24 lg:py-32">
      <div className="glow-rose pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-3xl opacity-60" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <SectionTag>Services & pricing</SectionTag>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-cream">
                For every
                <br />
                <em className="text-sheen">occasion.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              Transparent pricing, exact durations. Pick a service to book instantly.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.06}>
              <button
                onClick={() => open(s)}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border hairline bg-ink-2/90 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-rose/40 hover:shadow-[0_24px_60px_-20px_rgba(238,169,196,0.25)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-3">
                  {/* Category badge as placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full border border-cream/10 bg-ink/40 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-cream/70 backdrop-blur-sm">
                      {s.categories?.name ?? "Service"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[22px] leading-tight text-cream">
                      {s.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-cream/8 px-3 py-1 text-sm font-semibold text-sheen">
                      ${Number(s.price)}
                    </span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-mist">
                      <Clock3 size={13} />
                      {s.duration} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-rose transition-all group-hover:gap-2.5">
                      Book
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
