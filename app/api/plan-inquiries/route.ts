import { NextResponse, type NextRequest } from "next/server";
import { permitsSubmission, validatePlanInquiry } from "@/lib/inquiries";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  if (!permitsSubmission(`plan:${key}`)) {
    return NextResponse.json({ error: "Please wait before sending another request." }, { status: 429 });
  }
  const input = validatePlanInquiry(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Check the interest form details." }, { status: 400 });
  const client = createServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Inquiry service is not configured." }, { status: 503 });

  const { error } = await client.from("plan_inquiries").insert({
    plan: input.plan,
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
    consent_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: "Unable to submit your interest." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
