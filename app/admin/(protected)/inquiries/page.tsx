import { InquiryBoard } from "@/components/admin/InquiryBoard";
import { requireAdmin } from "@/lib/supabase/server";
import type { Inquiry, PlanInquiry } from "@/types";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const { client } = await requireAdmin();
  const [{ data: inquiries }, { data: plans }] = await Promise.all([
    client.from("inquiries").select("*, items:inquiry_items(*)").order("created_at", { ascending: false }),
    client.from("plan_inquiries").select("*").order("created_at", { ascending: false }),
  ]);
  return <InquiryBoard initialCart={(inquiries ?? []) as Inquiry[]} initialPlans={(plans ?? []) as PlanInquiry[]} />;
}
