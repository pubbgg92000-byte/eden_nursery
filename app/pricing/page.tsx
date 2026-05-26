import type { Metadata } from "next";
import { PlanExplorer } from "@/components/commerce/PlanExplorer";

export const metadata: Metadata = {
  title: "Garden Membership",
  description: "Register interest in EDEN's botanical curation plans.",
};

const plans = [
  { name: "Seedling", price: 19, description: "Perfect for new plant parents.", features: ["1 hardy plant selection", "Basic care guide", "Delivery consultation"] },
  { name: "Sprout", price: 39, description: "For growing collections.", features: ["2 premium plant selections", "Detailed care guides", "Priority consultation"], recommended: true },
  { name: "Bloom", price: 69, description: "For collectors seeking rarities.", features: ["3 rare plant selections", "Expert care consultation", "Early collection previews"] },
];

export default function PricingPage() {
  return <PlanExplorer plans={plans} />;
}
