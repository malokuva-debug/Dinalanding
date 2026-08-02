import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = getAdminClient();

    // Fetch services with their categories
    const { data: services, error: svcError } = await supabase
      .from("services")
      .select(`
        *,
        categories (
          name
        )
      `)
      .order("name");

    if (svcError) {
      console.error("Services fetch error:", svcError.message);
      return NextResponse.json({ services: [], error: "Database unavailable" }, { status: 500 });
    }

    return NextResponse.json({ services: services ?? [] });
  } catch {
    return NextResponse.json({ services: [], error: "Internal error" }, { status: 500 });
  }
}
