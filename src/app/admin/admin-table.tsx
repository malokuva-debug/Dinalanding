"use client";

import { Trash2 } from "lucide-react";
import { useOptimistic, useTransition } from "react";

type AdminBooking = {
  id: string;
  reference: string;
  status: string;
  serviceName: string;
  addons: Array<{ name?: string; price?: number }>;
  preferredDate: string;
  preferredTime: string;
  totalPrice: number;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  createdAt: string;
  worker?: string;
  duration?: number;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold/15 text-gold border-gold/30",
  confirmed: "bg-rose/15 text-rose border-rose/30",
  completed: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
  cancelled: "bg-red-400/10 text-red-300 border-red-400/25",
};

export function AdminTable({ initial }: { initial: AdminBooking[] }) {
  const [bookings, setBookings] = useOptimistic(initial);
  const [, startTransition] = useTransition();

  const changeStatus = (id: string, status: string) => {
    startTransition(async () => {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    });
  };

  const remove = async (id: string) => {
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const revenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total requests", value: bookings.length },
          { label: "Confirmed", value: confirmed },
          { label: "Pipeline value", value: `$${revenue}` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border hairline bg-ink-2 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-mist">{s.label}</p>
            <p className="mt-2 font-display text-3xl text-cream">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border hairline">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead>
            <tr className="border-b hairline bg-cream/[0.03] text-[11px] uppercase tracking-[0.16em] text-mist">
              <th className="px-4 py-3.5">Ref</th>
              <th className="px-4 py-3.5">Client</th>
              <th className="px-4 py-3.5">Service</th>
              <th className="px-4 py-3.5">Add-ons</th>
              <th className="px-4 py-3.5">When</th>
              <th className="px-4 py-3.5">Total</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-14 text-center text-mist">
                  No bookings yet — share the site and watch them roll in.
                </td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id} className="border-b hairline last:border-0 hover:bg-cream/[0.02]">
                <td className="px-4 py-4 font-mono text-[12px] text-rose">{b.reference}</td>
                <td className="px-4 py-4">
                  <p className="font-medium text-cream">{b.name}</p>
                  <p className="text-[11.5px] text-mist">
                    {b.phone}
                    {b.email && b.email !== "—" ? ` · ${b.email}` : ""}
                  </p>
                  {b.notes && (
                    <p className="mt-1 max-w-[220px] truncate text-[11.5px] italic text-mist/80" title={b.notes}>
                      "{b.notes}"
                    </p>
                  )}
                </td>
                <td className="px-4 py-4 text-cream/85">
                  {b.serviceName}
                  {b.duration ? (
                    <span className="ml-1 text-[11px] text-mist">{b.duration} min</span>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  {b.addons.length > 0 ? (
                    <ul className="space-y-0.5 text-[11.5px] text-mist">
                      {b.addons.map((a, i) => (
                        <li key={i}>
                          {a.name ?? "Add-on"}{" "}
                          <span className="text-mist/60">
                            {a.price != null ? `+$${a.price}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-mist/50">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-cream/85">
                  {b.preferredDate}
                  <br />
                  <span className="text-mist">{b.preferredTime}</span>
                </td>
                <td className="px-4 py-4 font-semibold text-sheen">${b.totalPrice}</td>
                <td className="px-4 py-4">
                  <select
                    value={b.status}
                    onChange={(e) => changeStatus(b.id, e.target.value)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide outline-none ${STATUS_STYLES[b.status] ?? STATUS_STYLES.pending}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-ink-2 text-cream">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => remove(b.id)}
                    aria-label="Delete booking"
                    className="rounded-full border hairline p-2 text-mist transition-colors hover:border-red-400/40 hover:text-red-300"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
