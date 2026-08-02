"use client";

import { useEffect, useState, useCallback } from "react";
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
import { ArrowLeft, Eye, LayoutList, LogOut, Palette, Plus, RotateCcw, Save, UploadCloud } from "lucide-react";
import type { Block, BlockType, SiteContent } from "@/lib/blocks/types";
import { BLOCK_LIBRARY } from "@/lib/blocks/types";
import { DEFAULT_CONTENT } from "@/lib/blocks/defaults";
import { SortableBlockCard } from "@/components/editor/sortable-block-card";
import { LiveCanvas, type Selection } from "@/components/editor/live-canvas";
import { GlobalStylePanel } from "@/components/editor/global-style-panel";

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
type LeftTab = "add" | "layers" | "global";

export default function EditorPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [leftTab, setLeftTab] = useState<LeftTab>("layers");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dirty, setDirty] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((json) => setContent(json.content))
      .catch(() => setStatus({ kind: "error", message: "Could not load content." }));
  }, []);

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
    setLeftTab("layers");
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
            title="Open the full responsive page in a new tab — useful for checking mobile layout"
          >
            <Eye size={14} /> Responsive preview
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
        {/* Left: Add / Layers / Global */}
        <aside className="flex w-[300px] shrink-0 flex-col border-r hairline bg-ink-2/50">
          <div className="flex border-b hairline">
            {[
              { key: "add" as const, label: "Add", icon: Plus },
              { key: "layers" as const, label: "Layers", icon: LayoutList },
              { key: "global" as const, label: "Global", icon: Palette },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setLeftTab(t.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-[12px] font-medium transition-colors ${
                  leftTab === t.key ? "border-rose text-cream" : "border-transparent text-mist hover:text-cream"
                }`}
              >
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {leftTab === "add" && (
              <>
                <p className="mb-3 px-1 text-[12px] text-mist">Click a block to add it to the end of the page.</p>
                <div className="grid grid-cols-2 gap-2">
                  {BLOCK_LIBRARY.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addBlock(item.type)}
                      className="rounded-xl border hairline bg-ink p-3 text-left transition-colors hover:border-rose/40"
                    >
                      <p className="text-[12.5px] font-semibold text-cream">{item.label}</p>
                      <p className="mt-1 text-[10.5px] leading-snug text-mist">{item.description}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {leftTab === "layers" && (
              <>
                <p className="mb-3 px-1 text-[12px] text-mist">Click anything here — or directly on the canvas — to jump to it.</p>
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
              </>
            )}

            {leftTab === "global" && (
              <GlobalStylePanel
                theme={content.settings.theme}
                onChange={(theme) => mutate((c) => ({ ...c, settings: { ...c.settings, theme } }))}
              />
            )}
          </div>
        </aside>

        {/* Canvas: the real, live site. Click any text to type directly into
            it, click an image to swap it, hover a block for its toolbar. */}
        <div className="min-w-0 flex-1 bg-ink-3/40">
          <LiveCanvas
            content={content}
            selection={selection}
            onSelect={setSelection}
            onUpdateBlock={updateBlock}
            onUpdateNavbar={(navbar) => mutate((c) => ({ ...c, settings: { ...c.settings, navbar } }))}
            onUpdateFooter={(footer) => mutate((c) => ({ ...c, settings: { ...c.settings, footer } }))}
            onMoveBlock={moveBlock}
            onDuplicateBlock={duplicateBlock}
            onRemoveBlock={removeBlock}
            onToggleHiddenBlock={toggleHidden}
          />
        </div>
      </div>
    </div>
  );
}
