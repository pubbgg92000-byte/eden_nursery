import { NextResponse, type NextRequest } from "next/server";
import { permitsSubmission, validateCartInquiry } from "@/lib/inquiries";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { InquiryItem, Product } from "@/types";

export async function POST(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  if (!permitsSubmission(`cart:${key}`)) {
    return NextResponse.json({ error: "Please wait before sending another request." }, { status: 429 });
  }
  const input = validateCartInquiry(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Check the inquiry details and try again." }, { status: 400 });

  const client = createServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Inquiry service is not configured." }, { status: 503 });

  const ids = input.items.map((item) => item.productId);
  const { data: products, error: productsError } = await client
    .from("products")
    .select("id, name, image_url, price, stock_quantity")
    .in("id", ids)
    .eq("is_published", true);
  if (productsError || !products || products.length !== ids.length) {
    return NextResponse.json({ error: "One or more plants are unavailable." }, { status: 400 });
  }

  const productMap = new Map((products as Pick<Product, "id" | "name" | "image_url" | "price" | "stock_quantity">[]).map((item) => [item.id, item]));
  const items: InquiryItem[] = input.items.map(({ productId, quantity }) => {
    const product = productMap.get(productId)!;
    return { product_id: product.id, product_name: product.name, image_url: product.image_url, quantity, unit_price: Number(product.price) };
  });
  const estimatedTotal = items.reduce((total, item) => total + item.quantity * item.unit_price, 0);
  const { data: inquiry, error } = await client
    .from("inquiries")
    .insert({ kind: "cart", name: input.name, email: input.email, phone: input.phone, message: input.message, estimated_total: estimatedTotal, consent_at: new Date().toISOString() })
    .select("id")
    .single();
  if (error || !inquiry) return NextResponse.json({ error: "Unable to submit the inquiry." }, { status: 500 });
  const { error: itemError } = await client.from("inquiry_items").insert(items.map((item) => ({ ...item, inquiry_id: inquiry.id })));
  if (itemError) return NextResponse.json({ error: "Unable to record requested plants." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
