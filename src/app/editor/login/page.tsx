"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditorLoginPage() {
  return (
    <Suspense fallback={null}>
      <EditorLoginForm />
    </Suspense>
  );
}

function EditorLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const unconfigured = params.get("unconfigured") === "1";
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Incorrect passcode.");
        setLoading(false);
        return;
      }
      router.push(params.get("next") ?? "/editor");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border hairline bg-ink-2 p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-rose">
          DINA · Site editor
        </p>
        <h1 className="mt-2 font-display text-3xl text-cream">Enter passcode</h1>

        {unconfigured && (
          <p className="mt-4 rounded-xl border border-gold/25 bg-gold/10 px-4 py-3 text-[12.5px] text-gold">
            No <code>EDITOR_PASSCODE</code> is set in your environment yet, so the editor is
            locked. Add it to your env vars and redeploy to enable editing.
          </p>
        )}

        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          autoFocus
          className="mt-6 w-full rounded-xl border hairline bg-ink px-4 py-3 text-cream outline-none placeholder:text-mist/60 focus:border-rose/50"
        />

        {error && <p className="mt-3 text-[13px] text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading || unconfigured}
          className="mt-5 w-full rounded-xl bg-cream px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-rose disabled:opacity-50"
        >
          {loading ? "Checking…" : "Enter editor"}
        </button>
      </form>
    </main>
  );
}
