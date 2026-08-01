import { getAdminClient } from "@/lib/supabase-server";
import { CONTENT_ID, DEFAULT_CONTENT } from "@/lib/blocks/defaults";
import type { SiteContent } from "@/lib/blocks/types";

const TABLE = "site_content";

// Merge fetched content with defaults so newly-added fields never crash old rows.
function normalize(raw: unknown): SiteContent {
  if (!raw || typeof raw !== "object") return DEFAULT_CONTENT;
  const r = raw as Partial<SiteContent>;
  return {
    blocks: Array.isArray(r.blocks) && r.blocks.length > 0 ? r.blocks : DEFAULT_CONTENT.blocks,
    settings: {
      navbar: { ...DEFAULT_CONTENT.settings.navbar, ...(r.settings?.navbar ?? {}) },
      footer: { ...DEFAULT_CONTENT.settings.footer, ...(r.settings?.footer ?? {}) },
    },
  };
}

/**
 * Published content for the public-facing site.
 * If the site_content table doesn't exist yet (migration not run) or the row
 * is missing, this silently falls back to DEFAULT_CONTENT so the live site
 * keeps working exactly as before — it never throws or shows an error page.
 */
export async function getPublishedContent(): Promise<SiteContent> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("published")
      .eq("id", CONTENT_ID)
      .single();

    if (error || !data?.published) return DEFAULT_CONTENT;
    return normalize(data.published);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function getDraftContent(): Promise<SiteContent> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("draft, published")
      .eq("id", CONTENT_ID)
      .single();

    if (error || (!data?.draft && !data?.published)) return DEFAULT_CONTENT;
    return normalize(data.draft ?? data.published);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function saveDraftContent(content: SiteContent): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: CONTENT_ID, draft: content, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function publishDraftContent(content: SiteContent): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = getAdminClient();

    // Keep a rollback copy of whatever was live before this publish.
    const { data: existing } = await supabase
      .from(TABLE)
      .select("published")
      .eq("id", CONTENT_ID)
      .single();

    const { error } = await supabase.from(TABLE).upsert(
      {
        id: CONTENT_ID,
        draft: content,
        published: content,
        previous: existing?.published ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function rollbackToPrevious(): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = getAdminClient();
    const { data: existing, error: fetchError } = await supabase
      .from(TABLE)
      .select("previous")
      .eq("id", CONTENT_ID)
      .single();
    if (fetchError || !existing?.previous) {
      return { ok: false, error: "No previous version to roll back to." };
    }
    const { error } = await supabase
      .from(TABLE)
      .update({ draft: existing.previous, published: existing.previous, updated_at: new Date().toISOString() })
      .eq("id", CONTENT_ID);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
