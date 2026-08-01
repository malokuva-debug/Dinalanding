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
import { SettingsInspector } from "@/components/editor/settings-inspector";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"blocks" | "settings">("blocks");
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
    () => content?.blocks.find((b) => b.id === selectedId) ?? null,
    [content, selectedId]
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
    setSelectedId(b.id);
    setView("blocks");
    setPaletteOpen(false);
  };

  const removeBlock = (id: string) => {
    mutate((c) => ({ ...c, blocks: c.blocks.filter((b) => b.id !== id) }));
    if (selectedId === id) setSelectedId(null);
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
      <header className="flex shrink-0 items-center justify-between border-b hairline bg-ink-2 px-5 py-3">
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
          >
            <Eye size={14} /> Preview draft
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
        {/* Left: block list / canvas */}
        <aside className="flex w-[320px] shrink-0 flex-col border-r hairline bg-ink-2/50">
          <div className="flex items-center justify-between border-b hairline px-4 py-3">
            <div className="flex gap-1 rounded-full border hairline p-0.5">
              <button
                onClick={() => setView("blocks")}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${view === "blocks" ? "bg-cream text-ink" : "text-mist"}`}
              >
                Blocks
              </button>
              <button
                onClick={() => setView("settings")}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${view === "settings" ? "bg-cream text-ink" : "text-mist"}`}
              >
                Site settings
              </button>
            </div>
          </div>

          {view === "blocks" && (
            <>
              <div className="flex-1 overflow-y-auto p-3">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={content.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {content.blocks.map((block) => (
                        <SortableBlockCard
                          key={block.id}
                          block={block}
                          selected={selectedId === block.id}
                          onSelect={() => setSelectedId(block.id)}
                          onDuplicate={() => duplicateBlock(block.id)}
                          onRemove={() => removeBlock(block.id)}
                          onToggleHidden={() => toggleHidden(block.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
              <div className="border-t hairline p-3">
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed hairline py-3 text-[13px] font-medium text-mist hover:border-rose/40 hover:text-rose"
                >
                  <Plus size={15} /> Add block
                </button>
              </div>
            </>
          )}

          {view === "settings" && (
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-3 text-[12.5px] text-mist">
                Edit global navbar &amp; footer content in the panel to the right.
              </p>
            </div>
          )}
        </aside>

        {/* Center: live preview note + inspector */}
        <main className="flex-1 overflow-y-auto p-6">
          {view === "blocks" && !selectedBlock && (
            <div className="mx-auto max-w-md py-24 text-center text-mist">
              <p className="font-display text-2xl text-cream">Select a block</p>
              <p className="mt-2 text-[13px]">
                Click any block on the left to edit its content, or add a new one. Use{" "}
                <span className="text-cream">Preview draft</span> to see your changes before publishing.
              </p>
            </div>
          )}
          {view === "blocks" && selectedBlock && (
            <div className="mx-auto max-w-xl">
              <BlockInspector block={selectedBlock} onChange={updateBlock} />
            </div>
          )}
          {view === "settings" && (
            <div className="mx-auto max-w-xl">
              <SettingsInspector settings={content.settings} onChange={(settings) => mutate((c) => ({ ...c, settings }))} />
            </div>
          )}
        </main>
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
