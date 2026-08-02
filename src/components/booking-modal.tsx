"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ─── Types matching Supabase schema ─── */

type DbService = {
  id: string;
  name: string;
  price: string;
  duration: number;
  category_id: string | null;
  categories?: { name: string | null };
};

type BookingState = {
  service: DbService | null;
  additionalServices: Array<{ name: string; price: number }>;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
};

const initialState: BookingState = {
  service: null,
  additionalServices: [],
  date: "",
  time: "",
  name: "",
  phone: "",
  notes: "",
};

const STEPS = ["Service", "Add-ons", "Date & time", "Details"];

const ADDONS = [
  { id: "chrome", name: "Chrome / mirror finish", price: 10 },
  { id: "hand-painted", name: "Hand-painted art", price: 15 },
  { id: "gems", name: "Gems & 3D accents", price: 8 },
  { id: "french", name: "French / baby boomer", price: 8 },
  { id: "paraffin", name: "Paraffin wax treatment", price: 15 },
  { id: "cuticle", name: "Cuticle remover treatment", price: 10 },
];

const TIME_SLOTS = [
  "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30",
];

function nextDays(count: number) {
  const days: { iso: string; weekday: string; day: number; month: string; sunday: boolean }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    days.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      sunday: d.getDay() === 0,
    });
  }
  return days;
}

/* ─── Component ─── */

export function BookingModal({
  isOpen,
  onClose,
  presetService,
}: {
  isOpen: boolean;
  onClose: () => void;
  presetService?: DbService | null;
}) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BookingState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [dbServices, setDbServices] = useState<DbService[]>([]);

  const days = useMemo(() => nextDays(21), []);

  // Fetch services from Supabase when modal opens
  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      if (!res.ok) return;
      const json = await res.json();
      setDbServices(json.services ?? []);
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      setStep(0);
      setState((s) => ({ ...initialState, service: presetService ?? null }));
      if (presetService) setStep(1); // skip service step if preset
      setError("");
      setReference("");
    }
  }, [isOpen, presetService, fetchServices]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const addonsTotal = state.additionalServices.reduce((sum, a) => sum + a.price, 0);
  const basePrice = state.service ? Number(state.service.price) : 0;
  const total = basePrice + addonsTotal;
  const busy = !!reference;

  const canContinue = () => {
    if (step === 0) return !!state.service;
    if (step === 2) return !!state.date && !!state.time;
    if (step === 3) {
      return state.name.trim().length > 1 && state.phone.trim().length >= 6;
    }
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: state.service?.id,
          service: state.service?.name,
          price: basePrice,
          duration: state.service?.duration ?? 30,
          additionalServices: state.additionalServices,
          preferredDate: state.date,
          preferredTime: state.time,
          name: state.name,
          phone: state.phone,
          notes: state.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setReference(data.booking?.reference ?? "Booked");
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAddon = (id: string) =>
    setState((s) => {
      const existing = ADDONS.find((a) => a.id === id);
      if (!existing) return s;
      const has = s.additionalServices.some((a) => a.name === existing.name);
      return {
        ...s,
        additionalServices: has
          ? s.additionalServices.filter((a) => a.name !== existing.name)
          : [...s.additionalServices, { name: existing.name, price: existing.price }],
      };
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/80 backdrop-blur-md sm:items-center sm:p-6"
          onClick={() => !busy && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] shadow-2xl sm:h-[min(760px,90vh)] sm:rounded-[2rem]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b hairline px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-rose/15 text-rose">
                  <Sparkles size={15} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold leading-tight text-cream">
                    Book your session
                  </p>
                  <p className="text-[11px] text-mist">Takes about a minute</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={busy}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full border hairline text-mist transition-colors hover:text-cream"
              >
                <X size={16} />
              </button>
            </div>

            {/* Step indicator */}
            {!busy && step < 5 && (
              <div className="flex items-center gap-2 border-b hairline px-6 py-3.5">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold transition-colors ${
                          i < step
                            ? "bg-rose text-ink"
                            : i === step
                              ? "bg-cream text-ink"
                              : "bg-cream/8 text-mist"
                        }`}
                      >
                        {i < step ? <Check size={12} /> : i + 1}
                      </span>
                      <span
                        className={`hidden text-[12px] font-medium sm:block ${
                          i === step ? "text-cream" : "text-mist"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <span className="mx-1 h-px w-5 bg-cream/15 sm:w-8" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {/* STEP 0 — SERVICE */}
                {step === 0 && (
                  <motion.div
                    key="s0"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <div>
                      <h3 className="font-display text-2xl text-cream">Choose your service</h3>
                      <p className="mt-1 text-[13px] text-mist">
                        Services are loaded from the studio database.
                      </p>
                    </div>
                    {dbServices.length === 0 && (
                      <p className="py-8 text-center text-[14px] text-mist">
                        No services available right now. Please check back later.
                      </p>
                    )}
                    {dbServices.map((s) => {
                      const active = state.service?.id === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setState((st) => ({ ...st, service: s }))}
                          className={`w-full rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? "border-rose/60 bg-rose/10 shadow-[0_0_30px_-8px_rgba(238,169,196,0.35)]"
                              : "hairline bg-cream/[0.02] hover:border-cream/25"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-cream">{s.name}</p>
                              <p className="mt-0.5 text-[12px] text-mist">
                                {s.categories?.name ?? "Service"}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="block text-sm font-bold text-sheen">
                                ${Number(s.price)}
                              </span>
                              <span className="block text-[11px] text-mist">
                                {s.duration} min
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* STEP 1 — ADD-ONS */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <div>
                      <h3 className="font-display text-2xl text-cream">
                        Elevate it, <em className="text-sheen">optional.</em>
                      </h3>
                      <p className="mt-1 text-[13px] text-mist">
                        Add-ons applied during your {state.service?.name} session. Skip to keep it classic.
                      </p>
                    </div>
                    {ADDONS.map((a) => {
                      const active = state.additionalServices.some((x) => x.name === a.name);
                      return (
                        <button
                          key={a.id}
                          onClick={() => toggleAddon(a.id)}
                          className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                            active
                              ? "border-rose/60 bg-rose/10"
                              : "hairline bg-cream/[0.02] hover:border-cream/25"
                          }`}
                        >
                          <span
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors ${
                              active
                                ? "border-rose bg-rose text-ink"
                                : "border-cream/25 text-transparent"
                            }`}
                          >
                            <Check size={13} strokeWidth={3} />
                          </span>
                          <span className="flex-1">
                            <span className="block text-[14px] font-medium text-cream">{a.name}</span>
                          </span>
                          <span className="text-sm font-bold text-sheen">+${a.price}</span>
                        </button>
                      );
                    })}
                    <p className="pt-1 text-[12px] text-mist">
                      Running total:{" "}
                      <span className="font-semibold text-cream">${total}</span>
                    </p>
                  </motion.div>
                )}

                {/* STEP 2 — DATE & TIME */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div>
                      <h3 className="font-display text-2xl text-cream">Pick a moment</h3>
                      <p className="mt-1 text-[13px] text-mist">
                        Your session runs about {state.service?.duration ?? 30} minutes. Sundays are rest days.
                      </p>
                    </div>

                    <p className="mb-2 mt-5 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-mist">
                      <CalendarDays size={13} /> Date
                    </p>
                    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                      {days.map((d) => {
                        const disabled = d.sunday;
                        const active = state.date === d.iso;
                        return (
                          <button
                            key={d.iso}
                            disabled={disabled}
                            onClick={() => setState((s) => ({ ...s, date: d.iso }))}
                            className={`flex min-w-[64px] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 transition-all ${
                              active
                                ? "border-rose bg-rose/15 text-cream"
                                : disabled
                                  ? "hairline bg-cream/[0.02] text-mist/40 line-through"
                                  : "hairline bg-cream/[0.03] text-mist hover:border-cream/30 hover:text-cream"
                            }`}
                          >
                            <span className="text-[10px] uppercase tracking-wider">{d.weekday}</span>
                            <span className="font-display text-xl leading-tight">{d.day}</span>
                            <span className="text-[10px] uppercase tracking-wider">{d.month}</span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="mb-2 mt-5 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.18em] text-mist">
                      <Clock3 size={13} /> Time
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setState((s) => ({ ...s, time: t }))}
                          className={`rounded-xl border py-2.5 text-[13px] font-medium transition-all ${
                            state.time === t
                              ? "border-rose bg-rose/15 text-cream"
                              : "hairline bg-cream/[0.03] text-mist hover:border-cream/30 hover:text-cream"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 — DETAILS */}
                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="font-display text-2xl text-cream">Who&apos;s being pampered?</h3>
                      <p className="mt-1 text-[13px] text-mist">
                        We&apos;ll confirm your slot shortly.
                      </p>
                    </div>
                    <label className="block">
                      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-mist">
                        Full name *
                      </span>
                      <input
                        className="field"
                        value={state.name}
                        onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                        placeholder="Jane Doe"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-mist">
                        Phone number *
                      </span>
                      <input
                        className="field"
                        value={state.phone}
                        onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
                        placeholder="+1 555 000 1234"
                        inputMode="tel"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-mist">
                        Inspiration & notes
                      </span>
                      <textarea
                        className="field min-h-[110px] resize-none"
                        value={state.notes}
                        onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
                        placeholder="Pinterest links, colour ideas, occasion — anything that helps us prep."
                      />
                    </label>
                  </motion.div>
                )}

                {/* STEP 4 — CONFIRM REVIEW (before submit) */}
                {step === 4 && state.service && (
                  <motion.div
                    key="s4"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className="font-display text-2xl text-cream">One last look</h3>
                    <p className="mt-1 text-[13px] text-mist">
                      Confirm the details below — we&apos;ll take care of the rest.
                    </p>

                    <div className="mt-5 overflow-hidden rounded-2xl border hairline">
                      <div className="flex items-center gap-4 border-b hairline bg-cream/[0.03] p-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream/5 text-[11px] font-semibold uppercase tracking-wider text-cream/60">
                          {state.service.categories?.name?.slice(0, 3) ?? "SRV"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-cream">{state.service.name}</p>
                          <p className="text-[12px] text-mist">
                            {state.service.duration} min · ${Number(state.service.price)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-sheen">${total}</span>
                      </div>
                      <div className="grid gap-4 p-4 text-[13.5px] sm:grid-cols-2">
                        {state.additionalServices.length > 0 && (
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist">
                              Add-ons
                            </p>
                            <ul className="mt-1.5 space-y-1">
                              {state.additionalServices.map((a) => (
                                <li key={a.name} className="flex justify-between text-cream/85">
                                  <span>{a.name}</span>
                                  <span className="text-mist">+${a.price}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist">When</p>
                          <p className="mt-1.5 text-cream/85">
                            {state.date &&
                              new Date(state.date + "T00:00:00").toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}{" "}
                            · {state.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist">Who</p>
                          <p className="mt-1.5 text-cream/85">{state.name}</p>
                          <p className="text-mist">{state.phone}</p>
                        </div>
                        {state.notes && (
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist">Notes</p>
                            <p className="mt-1.5 line-clamp-3 text-cream/85">{state.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {error && (
                      <p className="mt-4 rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-[13px] text-rose">
                        {error}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* SUCCESS */}
                {step === 5 && (
                  <motion.div
                    key="s5"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center py-8 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                      className="grid h-20 w-20 place-items-center rounded-full bg-rose/15 text-rose"
                    >
                      <CheckCircle2 size={40} />
                    </motion.span>
                    <h3 className="mt-6 font-display text-3xl text-cream">You&apos;re booked in.</h3>
                    <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-mist">
                      Your session request for{" "}
                      <span className="text-cream">{state.service?.name}</span>{" "}
                      on{" "}
                      <span className="text-cream">
                        {state.date &&
                          new Date(state.date + "T00:00:00").toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                        at {state.time}
                      </span>{" "}
                      is in. We&apos;ll confirm shortly.
                    </p>
                    <div className="mt-6 rounded-2xl border border-dashed border-rose/40 bg-rose/8 px-6 py-3">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-mist">Reference</p>
                      <p className="mt-1 font-display text-2xl tracking-[0.14em] text-sheen">
                        {reference}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="mt-8 rounded-full bg-cream px-8 py-3 text-sm font-semibold text-ink transition-colors hover:bg-rose"
                    >
                      Done — see you soon
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer nav */}
            {!busy && step < 5 && step < 4 && (
              <div className="flex items-center justify-between gap-4 border-t hairline px-6 py-4">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 rounded-full border hairline px-5 py-2.5 text-[13px] font-medium text-mist transition-colors hover:text-cream disabled:opacity-30"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>

                <div className="hidden text-right sm:block">
                  {state.service && step > 0 && (
                    <p className="text-[12px] text-mist">
                      Total <span className="text-[15px] font-bold text-sheen">${total}</span>
                    </p>
                  )}
                </div>

                {step < 3 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canContinue()}
                    className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-2.5 text-[13px] font-semibold text-ink transition-all hover:bg-rose disabled:opacity-30"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                ) : step === 3 ? (
                  <button
                    onClick={() => setStep(4)}
                    disabled={!canContinue()}
                    className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-2.5 text-[13px] font-semibold text-ink transition-all hover:bg-rose disabled:opacity-30"
                  >
                    Review booking
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={!canContinue() || submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-2.5 text-[13px] font-semibold text-ink transition-all hover:bg-rose disabled:opacity-30"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Booking…
                      </>
                    ) : (
                      <>
                        Confirm booking · ${total}
                        <Check size={14} />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Footer for review step (step 4) */}
            {!busy && step === 4 && (
              <div className="flex items-center justify-between gap-4 border-t hairline px-6 py-4">
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 rounded-full border hairline px-5 py-2.5 text-[13px] font-medium text-mist transition-colors hover:text-cream"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-2.5 text-[13px] font-semibold text-ink transition-all hover:bg-rose disabled:opacity-30"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Booking…
                    </>
                  ) : (
                    <>
                      Confirm booking · ${total}
                      <Check size={14} />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
