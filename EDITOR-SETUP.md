# 🎨 Visual Editor — Setup Guide

Your site now has a drag-and-drop page editor at **`/editor`**. This doc is
everything you need to turn it on. It's additive: nothing about your existing
booking system, services, or admin dashboard was changed or touched.

## What was added

- **`/editor`** — the visual builder. Drag blocks to reorder, click any block
  to edit its text/images, add/remove blocks from a library (Hero, About,
  Rich Text, Image Banner, Gallery, Testimonials, Stats, CTA, Spacer), plus a
  "Site settings" tab for the navbar and footer text.
- **Draft vs. Published** — edits are saved as a draft first. The live site
  only changes when you click **Publish**. You can open **Preview draft** at
  any time to see exactly what's about to go live, without publishing it.
- **One-click Rollback** — publishing keeps a copy of the previous live
  version, so a bad publish can be undone instantly from the editor's top bar.
- **Passcode-protected** — `/editor` and its API routes are locked behind a
  passcode (see setup below). No passcode set = the editor is locked, not
  wide open.
- **Services grid → category tabs** — `services-section.tsx` now groups your
  services into tabs by category instead of showing everything in one long
  grid. This is purely visual; it reads the same `/api/services` data as
  before.

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
2. Click blocks on the left to edit them, drag the grip handle to reorder,
   use **Add block** to insert new sections.
3. Click **Preview draft** any time to check your changes on the real page
   layout before anyone else sees them.
4. Click **Save draft** to keep your work without going live, or **Publish**
   to push it to the live site immediately.
5. If something looks wrong after publishing, click the rollback icon (↺) in
   the top bar to instantly restore the previous published version.

## Notes on the services tabs

Tabs are generated automatically from whatever categories your services
already have in the database — no extra setup needed. If a service has no
category, it's grouped under "Other". If you only have one category (or
none), the tabs are hidden automatically and it falls back to a plain grid.
