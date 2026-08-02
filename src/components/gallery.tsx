"use client";

import { Reveal, SectionTag } from "@/components/reveal";

const SHOTS = [
  { src: "/gallery/nail-03.jpg", label: "Chromed-out almond", span: true },
  { src: "/gallery/nail-04.jpg", label: "Bare-glam BIAB" },
  { src: "/gallery/nail-05.jpg", label: "Sculpted medium almond" },
  { src: "/gallery/nail-07.jpg", label: "Soft ivory set" },
  { src: "/gallery/nail-09.jpg", label: "Spa-fresh toes" },
  { src: "/gallery/nail-10.jpg", label: "Glossy nude sculpt" },
  { src: "/gallery/nail-11.jpg", label: "Hand-painted detail" },
  { src: "/gallery/nail-02.jpg", label: "Cherry chrome" },
  { src: "/gallery/nail-01.jpg", label: "Studio favourite" },
];

export function Gallery() {
  return (
    <section id="work" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 lg:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <SectionTag>Portfolio</SectionTag>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-cream">
              Work with
              <br />
              <em className="text-sheen">pure precision.</em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.16}>
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            A selection from the studio — every set photographed before it leaves the
            chair.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {SHOTS.map((shot, i) => (
          <Reveal key={shot.src + i} delay={(i % 3) * 0.05} className="break-inside-avoid">
            <figure className="group relative overflow-hidden rounded-2xl border hairline">
              <img
                src={shot.src}
                alt={shot.label}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  shot.span ? "aspect-[4/3]" : "aspect-[3/4]"
                }`}
              />
              <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-cream">
                  {shot.label}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
