"use client";

import type { SiteSettings } from "@/lib/blocks/types";
import { TextField, TextAreaField, ListEditor } from "@/components/editor/fields";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function NavbarSettingsInspector({
  nav,
  onChange,
}: {
  nav: SiteSettings["navbar"];
  onChange: (next: SiteSettings["navbar"]) => void;
}) {
  const set = (patch: Partial<typeof nav>) => onChange({ ...nav, ...patch });
  return (
    <div>
      <h3 className="mb-3 font-display text-lg text-cream">Navigation bar</h3>
      <TextField label="Logo text" value={nav.logoText} onChange={(v) => set({ logoText: v })} />
      <TextField label="Logo superscript (e.g. ®)" value={nav.logoSuperscript} onChange={(v) => set({ logoSuperscript: v })} />
      <TextField label="Tagline" value={nav.tagline} onChange={(v) => set({ tagline: v })} />
      <TextField label="Book button text" value={nav.bookButtonText} onChange={(v) => set({ bookButtonText: v })} />
      <ListEditor
        label="Nav links"
        items={nav.links}
        onChange={(links) => set({ links })}
        makeNew={() => ({ id: uid(), href: "#section", label: "New link" })}
        itemSummary={(it) => `${it.label} → ${it.href}`}
        renderItem={(it, update) => (
          <>
            <TextField label="Label" value={it.label} onChange={(v) => update({ label: v })} />
            <TextField label="Link (# for a section anchor)" value={it.href} onChange={(v) => update({ href: v })} />
          </>
        )}
      />
    </div>
  );
}

export function FooterSettingsInspector({
  footer,
  onChange,
}: {
  footer: SiteSettings["footer"];
  onChange: (next: SiteSettings["footer"]) => void;
}) {
  const set = (patch: Partial<typeof footer>) => onChange({ ...footer, ...patch });
  return (
    <div>
      <h3 className="mb-3 font-display text-lg text-cream">Footer</h3>
      <TextField label="Section tag" value={footer.tag} onChange={(v) => set({ tag: v })} />
      <TextField label="Heading — line 1" value={footer.heading1} onChange={(v) => set({ heading1: v })} />
      <TextField label="Heading emphasis" value={footer.headingEmphasis} onChange={(v) => set({ headingEmphasis: v })} />
      <TextAreaField label="Paragraph" value={footer.paragraph} onChange={(v) => set({ paragraph: v })} />
      <TextField label="Button text" value={footer.buttonText} onChange={(v) => set({ buttonText: v })} />
      <TextField label="Brand name" value={footer.brandName} onChange={(v) => set({ brandName: v })} />
      <TextAreaField label="Brand blurb" value={footer.brandBlurb} onChange={(v) => set({ brandBlurb: v })} rows={3} />
      <TextField label="Address" value={footer.address} onChange={(v) => set({ address: v })} />
      <TextField label="Hours — line 1" value={footer.hoursLine1} onChange={(v) => set({ hoursLine1: v })} />
      <TextField label="Hours — line 2" value={footer.hoursLine2} onChange={(v) => set({ hoursLine2: v })} />
      <TextField label="Email" value={footer.email} onChange={(v) => set({ email: v })} />
      <TextField label="Phone (e.g. +15550001234)" value={footer.phone} onChange={(v) => set({ phone: v })} />
      <TextField label="Instagram handle" value={footer.instagramHandle} onChange={(v) => set({ instagramHandle: v })} />
      <TextField label="Instagram URL" value={footer.instagramUrl} onChange={(v) => set({ instagramUrl: v })} />
      <TextField label="Copyright line" value={footer.copyrightText} onChange={(v) => set({ copyrightText: v })} />
    </div>
  );
}

export function SettingsInspector({
  settings,
  onChange,
}: {
  settings: SiteSettings;
  onChange: (next: SiteSettings) => void;
}) {
  return (
    <div className="space-y-8">
      <NavbarSettingsInspector nav={settings.navbar} onChange={(navbar) => onChange({ ...settings, navbar })} />
      <div className="border-t hairline pt-6">
        <FooterSettingsInspector footer={settings.footer} onChange={(footer) => onChange({ ...settings, footer })} />
      </div>
      <div className="border-t hairline pt-6">
        <p className="rounded-lg border border-gold/25 bg-gold/10 px-3 py-3 text-[12.5px] leading-relaxed text-gold">
          Booking form fields, the services list, and admin dashboard are managed separately and
          are not editable from here — that keeps your live bookings and pricing safe from
          accidental changes.
        </p>
      </div>
    </div>
  );
}
