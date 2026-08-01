import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminClient } from "@/lib/supabase-server";
import { AdminTable } from "@/app/admin/admin-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "DINA · Bookings",
};

export default async function AdminPage() {
  const supabase = getAdminClient();
  const { data: rows, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-ink px-5 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] text-mist transition-colors hover:text-rose"
          >
            <ArrowLeft size={14} /> Back to site
          </Link>
          <div className="mt-10 rounded-2xl border border-red-400/20 bg-red-400/8 px-6 py-8 text-center">
            <p className="font-display text-2xl text-red-300">Database error</p>
            <p className="mt-2 text-[13px] text-mist">{error.message}</p>
            <p className="mt-4 text-[12px] text-mist">
              Make sure <code className="text-cream">SUPABASE_URL</code> and{" "}
              <code className="text-cream">SUPABASE_SERVICE_ROLE_KEY</code> are set.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink px-5 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-mist transition-colors hover:text-rose"
        >
          <ArrowLeft size={14} /> Back to site
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-rose">
              DINA · Studio dashboard
            </p>
            <h1 className="mt-2 font-display text-4xl text-cream">Bookings</h1>
          </div>
          <p className="text-[13px] text-mist">
            {rows?.length ?? 0} request{(rows?.length ?? 0) === 1 ? "" : "s"} · synced from
            Supabase
          </p>
        </div>

        <div className="mt-8">
          <AdminTable
            initial={
              rows?.map((b) => ({
                id: b.id,
                reference: b.reference ?? `DNA-${b.id.slice(0, 6).toUpperCase()}`,
                status: b.status ?? "pending",
                serviceName: b.service ?? "—",
                addons: (b.additional_services ?? []) as Array<{ name?: string; price?: number }>,
                preferredDate: b.date ? new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—",
                preferredTime: b.time ? String(b.time).slice(0, 5) : "—",
                totalPrice: Number(b.price ?? 0),
                name: b.customer_name ?? "—",
                email: b.customer_email ?? "—",
                phone: b.customer_phone ?? "—",
                notes: b.notes ?? null,
                createdAt: b.created_at ?? new Date().toISOString(),
                worker: b.worker ?? "dina",
                duration: b.duration ?? 30,
              })) ?? []
            }
          />
        </div>
      </div>
    </main>
  );
}
