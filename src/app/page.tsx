import { cookies } from "next/headers";
import { BookingProvider } from "@/components/booking-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getPublishedContent, getDraftContent } from "@/lib/site-content-server";
import { themeToCssVars } from "@/lib/theme-style";

// Always fetch fresh content — publishing from /editor should show up
// immediately without a redeploy.
export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const sp = await searchParams;
  let content;

  if (sp.preview === "1") {
    // Draft preview is only ever shown to someone holding a valid editor
    // session cookie — everyone else on ?preview=1 just sees the live site.
    const cookieStore = await cookies();
    const auth = cookieStore.get("editor_auth")?.value;
    content = auth && auth === process.env.EDITOR_PASSCODE ? await getDraftContent() : await getPublishedContent();
  } else {
    content = await getPublishedContent();
  }

  return (
    <div style={themeToCssVars(content.settings.theme)}>
      <BookingProvider>
        <Navbar settings={content.settings.navbar} />
        <main>
          <BlockRenderer blocks={content.blocks} />
        </main>
        <Footer settings={content.settings.footer} />
      </BookingProvider>
    </div>
  );
}
