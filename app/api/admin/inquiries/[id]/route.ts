import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";
import type { InquiryStatus } from "@/types";

const statuses = new Set<InquiryStatus>(["new", "contacted", "closed"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { client } = await requireAdmin();
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { kind?: string; status?: InquiryStatus } | null;
  if (!body?.status || !statuses.has(body.status) || !["cart", "plan"].includes(body.kind ?? "")) {
    return NextResponse.json({ error: "Invalid inquiry status." }, { status: 400 });
  }
  const table = body.kind === "cart" ? "inquiries" : "plan_inquiries";
  const { error } = await client.from(table).update({ status: body.status }).eq("id", id);
  if (error) return NextResponse.json({ error: "Unable to update inquiry." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
