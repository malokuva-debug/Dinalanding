# 🎨 Visual Editor — Setup Guide

Your site now has a drag-and-drop page editor at **`/editor`**. This doc is
everything you need to turn it on. It's additive: nothing about your existing
booking system, services, or admin dashboard was changed or touched.

## What was added

- **`/editor`** — a true live visual builder. The canvas IS the real site
  (same components your visitors see). Click any piece of text and type
  directly into it. Click an image to swap its URL right there. Add/remove
  items in lists (gallery photos, stats, reviews) with small +/× controls
  that appear on hover. Everything updates on the canvas the instant you
  change it — there's no separate form panel and no preview step to see the
  result.
- **Left panel — Add / Layers / Global:**
  - **Add** — click a block type to append it to the page (Hero, About,
    Rich Text, Image Banner, Gallery, Testimonials, Stats, CTA, Spacer,
    or the locked Services placeholder).
  - **Layers** — a compact, drag-to-reorder list of every block plus the
    Navbar and Footer, for quick jumps on a long page.
  - **Global** — site-wide color swatches (background, text, accent
    colors). Changing one updates the whole canvas instantly and applies
    everywhere once published.
- Hovering any block on the canvas shows a small floating toolbar: move
  up/down, duplicate, hide, delete.
- **Draft vs. Published** — edits save as a draft first; the live site only
  changes when you click **Publish**. **Responsive preview** opens the real,
  fully responsive page in a new tab (see note below on why that still
  matters for mobile).
- **One-click Rollback** — publishing keeps a copy of the previous live
  version, undoable instantly from the top bar.
- **Passcode-protected** — `/editor` and its API routes are locked behind a
  passcode (see setup below).
- **Services grid → category tabs** — `services-section.tsx` groups your
  services into tabs by category instead of one long list. Purely visual;
  reads the same `/api/services` data as before.

### A note on the live canvas vs. mobile preview

The canvas renders your actual components at desktop width — colors, fonts,
spacing and content are pixel-accurate live, and typing/clicking edits them
in place. It does not simulate narrower phone/tablet viewports (that needs
an iframe-based canvas, a bigger structural change than this pass covers).
For checking a change on mobile specifically, use **Responsive preview** —
it opens your real, fully responsive page in a new tab, reading your
unpublished draft.

## What was NOT touched

- `booking-modal.tsx`, `booking-context.tsx` — your booking form, its fields,
  and its look are exactly as they were.
- `/api/bookings`, `/api/bookings/[id]` — booking creation/status/delete logic
  is untouched.
- `/api/services` — untouched. The editor cannot edit services, pricing, or
  categories; the "Services" block in the editor is a locked placeholder that
  always renders the real, live grid — you can move it up/down the page, but
  its content always comes from your database.
- `/app/admin/*` — your bookings dashboard is unchanged.

## Setup (3 steps)

### 1. Run the database migration

In your Supabase project → **SQL Editor**, run the contents of
`supabase/001_site_content.sql`. It creates one new table, `site_content`,
used only to store editor draft/published content. It does not touch
`appointments`, `clients`, `services`, or `categories` in any way, and Row
Level Security is enabled with no public policies, so only your server
(via the existing service-role key) can read or write it.

If you skip this step, the site keeps working exactly as it does today — the
homepage silently falls back to the current hardcoded content, and `/editor`
will just show a "not configured" style error until the table exists.

### 2. Set an editor passcode

Add this to your `.env` (and to your host's environment variables, e.g.
Vercel → Project → Settings → Environment Variables):

```env
EDITOR_PASSCODE=choose-a-strong-passcode-here
```

Anyone with this passcode can edit and publish site content, so treat it like
a password — don't reuse an existing one, and only share it with people who
should be able to edit the site.

### 3. Deploy / restart

```bash
npm install
npm run build
npm start
```

Then visit `/editor`, enter your passcode, and start editing. Your first
**Publish** will populate the `site_content` table with your current content
(the editor loads your existing hardcoded copy as the starting draft, so the
first save/publish won't change anything visually).

## Day-to-day use

1. Go to `/editor`, log in with your passcode.
2. The canvas in the middle is your real site. Click on any heading,
   paragraph, or button label and start typing — it edits in place.
3. Hover an image and click **Change image** to swap its URL.
4. Hover over list items (photos, stats, reviews) for a small × to remove
   them, or use the dashed "+" tile to add a new one.
5. Hover any block for its floating toolbar — move up/down, duplicate, hide,
   or delete it. Use the **Layers** tab on the left to reorder a long page
   by dragging, or **Add** to insert a new block.
6. Use the **Global** tab to adjust site-wide colors.
7. Click **Save draft** to keep your work without going live, or **Publish**
   to push it to the live site immediately.
8. If something looks wrong after publishing, click the rollback icon (↺) in
   the top bar to instantly restore the previous published version.

## Notes on the services tabs

Tabs are generated automatically from whatever categories your services
already have in the database — no extra setup needed. If a service has no
category, it's grouped under "Other". If you only have one category (or
none), the tabs are hidden automatically and it falls back to a plain grid.
