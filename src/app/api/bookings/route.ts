import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

/**
 * POST /api/bookings
 *
 * Exact schema match for the user's Supabase `appointments` and `clients` tables.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serviceId, service, price, duration, additionalServices, preferredDate, preferredTime, name, phone, notes } = body;

    // ---- validate contact ----
    if (!String(name ?? "").trim() || !String(phone ?? "").trim()) {
      return NextResponse.json({ error: "Please provide your name and phone number." }, { status: 400 });
    }

    // ---- validate schedule ----
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!datePattern.test(String(preferredDate ?? "")) || !timePattern.test(String(preferredTime ?? ""))) {
      return NextResponse.json({ error: "Please select a valid date and time." }, { status: 400 });
    }

    // ---- compute combined datetime ----
    const datetime = new Date(`${preferredDate}T${preferredTime}:00`);

    // ---- client: upsert by phone ----
    const trimmedName = String(name).trim();
    const trimmedPhone = String(phone).trim();
    const trimmedNotes = String(notes ?? "").trim() || null;

    const supabase = getAdminClient();

    const { data: existingClient } = await supabase
      .from("clients")
      .select("id, visits, appointments, frequent_service")
      .eq("phone", trimmedPhone)
      .single();

    let clientId: string | null = existingClient?.id ?? null;
    const visits = (existingClient?.visits ?? 0) + 1;
    const appointmentsCount = (existingClient?.appointments ?? 0) + 1;

    if (!clientId) {
      const { data: inserted, error: clientErr } = await supabase
        .from("clients")
        .insert({
          name: trimmedName,
          phone: trimmedPhone,
          notes: trimmedNotes,
          visits: 1,
          appointments: 1,
          frequent_service: String(service ?? ""),
        })
        .select("id")
        .single();

      if (clientErr && clientErr.code !== "23505") {
        console.error("Client insert error:", clientErr.message);
      }
      clientId = inserted?.id ?? null;
    } else {
      await supabase
        .from("clients")
        .update({
          name: trimmedName,
          notes: trimmedNotes,
          visits,
          appointments: appointmentsCount,
          frequent_service: String(service ?? ""),
        })
        .eq("id", clientId);
    }

    // ---- insert appointment ----
    const { data: inserted, error: apptError } = await supabase
      .from("appointments")
      .insert({
        worker: "dina",
        service: String(service ?? ""),
        date: preferredDate,
        time: preferredTime,
        price: Number(price ?? 0),
        customer_name: trimmedName,
        customer_phone: trimmedPhone,
        status: "pending",
        is_done: false,
        duration: Number(duration ?? 30),
        reminder_sent: false,
        discount_applied: false,
        datetime: datetime.toISOString(),
        estimated_completion_time: new Date(datetime.getTime() + (duration ?? 30) * 60000).toTimeString().slice(0, 5),
        client_id: clientId,
        additional_services: Array.isArray(additionalServices) ? additionalServices : [],
      })
      .select("*")
      .single();

    if (apptError) {
      console.error("Appointment insert error:", apptError.message);
      return NextResponse.json(
        { error: "Could not save your appointment. Please try again." },
        { status: 500 }
      );
    }

    // ---- build response ----
    const reference = `DNA-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.floor(10 + Math.random() * 89)}`;
    const total = (inserted as Record<string, unknown>).additional_services
      ? (Number(price ?? 0) +
          ((inserted as Record<string, unknown>).additional_services as Array<{ price?: number }>).reduce(
            (sum, a) => sum + (a.price ?? 0),
            0
          ))
      : Number(price ?? 0);

    return NextResponse.json({ booking: { ...inserted, reference, total }, client_id: clientId }, { status: 201 });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
