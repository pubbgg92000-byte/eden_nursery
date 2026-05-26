import type { CartInquiryInput, PlanInquiryInput } from "@/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validPlans = new Set(["Seedling", "Sprout", "Bloom"]);
const attempts = new Map<string, number[]>();

export function permitsSubmission(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((stamp) => now - stamp < 60_000);
  if (recent.length >= 4) return false;
  attempts.set(key, [...recent, now]);
  return true;
}

export function validateCartInquiry(input: unknown): CartInquiryInput | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Partial<CartInquiryInput>;
  if (
    typeof value.name !== "string" ||
    value.name.trim().length < 2 ||
    typeof value.email !== "string" ||
    !emailPattern.test(value.email) ||
    value.consent !== true ||
    !Array.isArray(value.items) ||
    value.items.length === 0 ||
    value.items.length > 25
  ) return null;
  if (value.website) return null;
  if (!value.items.every((item) => typeof item.productId === "string" && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20)) return null;
  return {
    name: value.name.trim().slice(0, 120),
    email: value.email.trim().toLowerCase(),
    phone: value.phone?.trim().slice(0, 30),
    message: value.message?.trim().slice(0, 1000),
    consent: true,
    items: value.items,
  };
}

export function validatePlanInquiry(input: unknown): PlanInquiryInput | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Partial<PlanInquiryInput>;
  if (
    typeof value.plan !== "string" ||
    !validPlans.has(value.plan) ||
    typeof value.name !== "string" ||
    value.name.trim().length < 2 ||
    typeof value.email !== "string" ||
    !emailPattern.test(value.email) ||
    value.consent !== true ||
    value.website
  ) return null;
  return {
    plan: value.plan,
    name: value.name.trim().slice(0, 120),
    email: value.email.trim().toLowerCase(),
    phone: value.phone?.trim().slice(0, 30),
    message: value.message?.trim().slice(0, 1000),
    consent: true,
  };
}
