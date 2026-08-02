# 🔗 Connecting DINA Client Site → Your Supabase Database

The entire client-facing website (booking flow, services, gallery, reviews, footer) is now **wired to Supabase** — the same database your admin panel uses.

## What you need to do

### 1. Fill in `.env` with your Supabase credentials

Open `.env` and replace the placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

You can find these in your **Supabase Dashboard → Project Settings → API**.

### 2. Make sure your tables have the expected columns

The booking API writes to two tables. Here are the columns it expects:

#### `appointments` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | `int8` (auto) | Primary key |
| `reference` | `text` | Booking ref (e.g. `DNA-XSM321`) |
| `client_id` | `int8` | FK to `clients.id` (nullable) |
| `client_name` | `text` | — |
| `client_email` | `text` | — |
| `client_phone` | `text` | — |
| `service_id` | `text` | — |
| `service_name` | `text` | — |
| `service_price` | `int4` | — |
| `duration_min` | `int4` | — |
| `addons` | `jsonb` | Array of add-on objects |
| `appointment_date` | `text` | e.g. `2026-08-05` |
| `appointment_time` | `text` | e.g. `14:30` |
| `status` | `text` | `pending`, `confirmed`, etc. |
| `total_price` | `int4` | Service + add-ons |
| `notes` | `text` | Client's inspiration/notes |
| `source` | `text` | Always `"website"` for online bookings |
| `created_at` | `timestamptz` | Auto-set |
| `worker_id` | `text` | Nullable — assign in admin |

#### `clients` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | `int8` (auto) | Primary key |
| `name` | `text` | — |
| `email` | `text` | Unique |
| `phone` | `text` | — |
| `notes` | `text` | Nullable |
| `last_appointment` | `text` | Nullable — latest booking date |

### 3. If your column names differ

Open these files and update the field names to match your Supabase schema:

- **`src/app/api/bookings/route.ts`** → the `appointmentPayload` object (line ~87)
- **`src/app/api/bookings/[id]/route.ts`** → already generic, no changes needed
- **`src/app/admin/page.tsx`** → the `map()` function that reads rows (line ~48) — it already handles multiple naming variants (`appointment_date` / `preferredDate` / `date`, etc.)

### 4. If your table names differ

Open **`src/lib/supabase-server.ts`** and change:

```ts
export const TABLES = {
  appointments: "your_actual_table_name",
  clients: "your_actual_table_name",
} as const;
```

---

## How it works

```
Client (browser)
  │
  ├─ Selects service, add-ons, date/time, fills details
  │
  └─ Clicks "Confirm booking"
       │
       ▼
  POST /api/bookings (server route, secrets safe)
       │
       ├─ 1. Upserts client into `clients` table (by email)
       ├─ 2. Creates appointment in `appointments` table
       └─ 3. Returns booking with reference code
              │
              ▼
  Your admin dashboard sees it instantly
```

---

## Admin dashboard (`/admin`)

- Reads all appointments from Supabase
- Shows stats (total, confirmed, pipeline value)
- Lets you change status (pending → confirmed → completed / cancelled)
- Lets you delete bookings
- Already handles multiple column-name variants automatically

---

## Services

Services are defined in **`src/lib/services.ts`** (8 services with full details, pricing, durations). These are currently hardcoded but you can pull them from a `services` table in Supabase later.

---

## Testing

```bash
# Run dev
npm run dev

# Test booking API
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"gel-extensions","addonIds":["chrome","gems"],"preferredDate":"2026-08-10","preferredTime":"14:30","name":"Jane Doe","email":"jane@test.com","phone":"+15551234567","notes":"Chrome almond set for wedding"}'
```

You should see the appointment appear in both the Supabase table and your admin dashboard.
