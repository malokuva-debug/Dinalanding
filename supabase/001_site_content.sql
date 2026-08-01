-- Run this once in Supabase → SQL Editor.
-- Creates a NEW table only. It does not touch appointments, clients,
-- services, or categories in any way — your booking system is unaffected.

create table if not exists site_content (
  id text primary key,
  draft jsonb,
  published jsonb,
  previous jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: only your server (using the service role key) can
-- read/write this table. The public site fetches published content through
-- your Next.js server, never directly from the browser, so this stays locked down.
alter table site_content enable row level security;

-- No policies are created on purpose — with RLS on and zero policies,
-- the anon/public key gets zero access, and only the service role
-- (used server-side in supabase-server.ts) can read or write.
