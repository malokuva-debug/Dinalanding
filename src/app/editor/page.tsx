"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ArrowLeft, Eye, LogOut, Plus, RotateCcw, Save, UploadCloud, X } from "lucide-react";
import type { Block, BlockType, SiteContent } from "@/lib/blocks/types";
import { BLOCK_LIBRARY } from "@/lib/blocks/types";
import { DEFAULT_CONTENT } from "@/lib/blocks/defaults";
import { SortableBlockCard } from "@/components/editor/sortable-block-card";
import { BlockInspector } from "@/components/editor/block-inspector";
import { NavbarSettingsInspector, FooterSettingsInspector } from "@/components/editor/settings-inspector";
import { LiveCanvas, type Selection } from "@/components/editor/live-canvas";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function newBlock(type: BlockType): Block {
  const id = `${type}-${uid()}`;
  switch (type) {
    case "hero":
      return { id, type, data: structuredClone(DEFAULT_CONTENT.blocks.find((b) => b.type === "hero")!.data as Block["data"]) } as Block;
    case "about":
      return { id, type, data: structuredClone(DEFAULT_CONTENT.blocks.find((b) => b.type === "about")!.data as Block["data"]) } as Block;
    case "gallery":
      return {
        id,
        type,
        data: { tag: "Gallery", heading1: "New", heading2: "", headingEmphasis: "section", paragraph: "", items: [] },
      } as Block;
    case "testimonials":
      return {
        id,
        type,
        data: { tag: "Reviews", heading1: "New", heading2: "", headingEmphasis: "section", paragraph: "", items: [] },
      } as Block;
    case "richtext":
      return { id, type, data: { tag: "Section", heading: "New heading", body: "Write something here.", align: "left" } } as Block;
    case "imageBanner":
      return { id, type, data: { image: "/gallery/nail-01.jpg", caption: "", heightClass: "medium" } } as Block;
    case "stats":
      return { id, type, data: { items: [{ id: uid(), value: "0", label: "Stat" }] } } as Block;
    case "cta":
      return {
        id,
        type,
        data: { tag: "Get in touch", heading1: "Ready when", headingEmphasis: "you are.", paragraph: "", buttonText: "Book a session" },
      } as Block;
    case "spacer":
      return { id, type, data: { heightPx: 60 } } as Block;
    case "servicesLocked":
      return { id, type, data: {} } as Block;
    default:
      throw new Error("Unknown block type");
  }
}

type Status = { kind: "idle" | "saving" | "saved" | "publishing" | "published" | "error"; message?: string };

export default function EditorPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dirty, setDirty] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((json) => setContent(json.content))
      .catch(() => setStatus({ kind: "error", message: "Could not load content." }));
  }, []);

  const selectedBlock = useMemo(
    () => (selection?.kind === "block" ? content?.blocks.find((b) => b.id === selection.id) ?? null : null),
    [content, selection]
  );

  const mutate = useCallback((updater: (c: SiteContent) => SiteContent) => {
    setContent((prev) => (prev ? updater(prev) : prev));
    setDirty(true);
  }, []);

  const updateBlock = (next: Block) => {
    mutate((c) => ({ ...c, blocks: c.blocks.map((b) => (b.id === next.id ? next : b)) }));
  };

  const addBlock = (type: BlockType) => {
    const b = newBlock(type);
    mutate((c) => ({ ...c, blocks: [...c.blocks, b] }));
    setSelection({ kind: "block", id: b.id });
    setPaletteOpen(false);
  };

  const removeBlock = (id: string) => {
    mutate((c) => ({ ...c, blocks: c.blocks.filter((b) => b.id !== id) }));
    if (selection?.kind === "block" && selection.id === id) setSelection(null);
  };

  const duplicateBlock = (id: string) => {
    mutate((c) => {
      const idx = c.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return c;
      const clone = { ...structuredClone(c.blocks[idx]), id: `${c.blocks[idx].type}-${uid()}` };
      const blocks = [...c.blocks];
      blocks.splice(idx + 1, 0, clone);
      return { ...c, blocks };
    });
  };

  const toggleHidden = (id: string) => {
    mutate((c) => ({ ...c, blocks: c.blocks.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b)) }));
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    mutate((c) => {
      const idx = c.blocks.findIndex((b) => b.id === id);
      const target = idx + dir;
      if (idx === -1 || target < 0 || target >= c.blocks.length) return c;
      return { ...c, blocks: arrayMove(c.blocks, idx, target) };
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    mutate((c) => {
      const oldIndex = c.blocks.findIndex((b) => b.id === active.id);
      const newIndex = c.blocks.findIndex((b) => b.id === over.id);
      return { ...c, blocks: arrayMove(c.blocks, oldIndex, newIndex) };
    });
  };

  const saveDraft = async () => {
    if (!content) return;
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Save failed");
      setDirty(false);
      setStatus({ kind: "saved" });
      setTimeout(() => setStatus({ kind: "idle" }), 2000);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    }
  };

  const publish = async () => {
    if (!content) return;
    if (!window.confirm("Publish these changes to the live site now?")) return;
    setStatus({ kind: "publishing" });
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Publish failed");
      setDirty(false);
      setStatus({ kind: "published" });
      setTimeout(() => setStatus({ kind: "idle" }), 2500);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Publish failed" });
    }
  };

  const rollback = async () => {
    if (!window.confirm("Roll the LIVE site back to the previously published version? This can't be undone.")) return;
    try {
      const res = await fetch("/api/admin/rollback", { method: "POST" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Rollback failed");
      const refreshed = await fetch("/api/admin/content").then((r) => r.json());
      setContent(refreshed.content);
      setDirty(false);
      setStatus({ kind: "saved", message: "Rolled back." });
      setTimeout(() => setStatus({ kind: "idle" }), 2000);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Rollback failed" });
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/editor/login";
  };

  if (!content) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink">
        <p className="text-mist">Loading editor…</p>
      </main>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-ink">
      {/* Top bar */}
      <header className="relative z-30 flex shrink-0 items-center justify-between border-b hairline bg-ink-2 px-5 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-[13px] text-mist hover:text-cream">
            <ArrowLeft size={14} /> Site
          </Link>
          <p className="font-display text-lg text-cream">Editor</p>
          {dirty && <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-medium text-gold">Unsaved changes</span>}
        </div>

        <div className="flex items-center gap-2">
          {status.kind === "error" && <span className="mr-2 text-[12px] text-red-300">{status.message}</span>}
          {status.kind === "saved" && <span className="mr-2 text-[12px] text-emerald-300">{status.message ?? "Draft saved"}</span>}
          {status.kind === "published" && <span className="mr-2 text-[12px] text-emerald-300">Published!</span>}

          <a
            href="/?preview=1"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border hairline px-3.5 py-2 text-[12.5px] font-medium text-cream hover:border-rose/40 hover:text-rose"
            title="Open the full responsive page in a new tab"
          >
            <Eye size={14} /> Full-page preview
          </a>
          <button
            onClick={saveDraft}
            disabled={status.kind === "saving"}
            className="flex items-center gap-1.5 rounded-full border hairline px-3.5 py-2 text-[12.5px] font-medium text-cream hover:border-cream/40 disabled:opacity-50"
          >
            <Save size={14} /> {status.kind === "saving" ? "Saving…" : "Save draft"}
          </button>
          <button
            onClick={publish}
            disabled={status.kind === "publishing"}
            className="flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-[12.5px] font-semibold text-ink hover:bg-rose disabled:opacity-50"
          >
            <UploadCloud size={14} /> {status.kind === "publishing" ? "Publishing…" : "Publish"}
          </button>
          <button
            onClick={rollback}
            className="flex items-center gap-1.5 rounded-full border hairline px-3 py-2 text-[12.5px] text-mist hover:border-red-400/40 hover:text-red-300"
            title="Roll live site back to the previous published version"
          >
            <RotateCcw size={14} />
          </button>
          <button onClick={logout} className="rounded-full border hairline p-2 text-mist hover:text-cream" aria-label="Log out">
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left: compact layer list — for quick jumps and bulk reordering */}
        <aside className="flex w-[260px] shrink-0 flex-col border-r hairline bg-ink-2/50">
          <div className="border-b hairline px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">Layers</p>
            <p className="mt-0.5 text-[11px] text-mist/70">Click a block on the canvas or here to edit it live.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <button
              onClick={() => setSelection({ kind: "navbar" })}
              className={`mb-2 w-full rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-medium transition-colors ${
                selection?.kind === "navbar" ? "border-rose/50 bg-rose/10 text-cream" : "border hairline text-mist hover:text-cream"
              }`}
            >
              Navbar
            </button>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={content.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {content.blocks.map((block) => (
                    <SortableBlockCard
                      key={block.id}
                      block={block}
                      selected={selection?.kind === "block" && selection.id === block.id}
                      onSelect={() => setSelection({ kind: "block", id: block.id })}
                      onDuplicate={() => duplicateBlock(block.id)}
                      onRemove={() => removeBlock(block.id)}
                      onToggleHidden={() => toggleHidden(block.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              onClick={() => setSelection({ kind: "footer" })}
              className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-medium transition-colors ${
                selection?.kind === "footer" ? "border-rose/50 bg-rose/10 text-cream" : "border hairline text-mist hover:text-cream"
              }`}
            >
              Footer
            </button>
          </div>
          <div className="border-t hairline p-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed hairline py-3 text-[13px] font-medium text-mist hover:border-rose/40 hover:text-rose"
            >
              <Plus size={15} /> Add block
            </button>
          </div>
        </aside>

        {/* Center: live canvas — the actual rendered site */}
        <div className="min-w-0 flex-1 bg-ink-3/40">
          <LiveCanvas
            content={content}
            selection={selection}
            onSelect={setSelection}
            onMoveBlock={moveBlock}
            onDuplicateBlock={duplicateBlock}
            onRemoveBlock={removeBlock}
            onToggleHiddenBlock={toggleHidden}
          />
        </div>

        {/* Right: inspector for whatever is currently selected — edits apply
            to the canvas instantly, no separate preview step needed. */}
        {selection && (
          <aside className="w-[340px] shrink-0 overflow-y-auto border-l hairline bg-ink-2/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">Edit</p>
              <button onClick={() => setSelection(null)} className="rounded p-1 text-mist hover:text-cream" aria-label="Close">
                <X size={15} />
              </button>
            </div>

            {selection.kind === "block" && selectedBlock && (
              <BlockInspector block={selectedBlock} onChange={updateBlock} />
            )}
            {selection.kind === "navbar" && (
              <NavbarSettingsInspector
                nav={content.settings.navbar}
                onChange={(navbar) => mutate((c) => ({ ...c, settings: { ...c.settings, navbar } }))}
              />
            )}
            {selection.kind === "footer" && (
              <FooterSettingsInspector
                footer={content.settings.footer}
                onChange={(footer) => mutate((c) => ({ ...c, settings: { ...c.settings, footer } }))}
              />
            )}
          </aside>
        )}
      </div>

      {/* Add-block palette modal */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 backdrop-blur-sm" onClick={() => setPaletteOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border hairline bg-ink-2 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl text-cream">Add a block</p>
              <button onClick={() => setPaletteOpen(false)} className="rounded-full p-1.5 text-mist hover:text-cream">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_LIBRARY.map((item) => (
                <button
                  key={item.type}
                  onClick={() => addBlock(item.type)}
                  className="rounded-xl border hairline bg-ink p-3.5 text-left transition-colors hover:border-rose/40"
                >
                  <p className="text-[13.5px] font-semibold text-cream">{item.label}</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-mist">{item.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
