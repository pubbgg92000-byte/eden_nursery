export type CareLevel = "Easy" | "Moderate" | "Expert";
export type InquiryStatus = "new" | "contacted" | "closed";
export type InquiryKind = "cart" | "plan";

export interface Profile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  story?: string | null;
  price: number;
  image_url: string;
  category_id?: string | null;
  category?: Category | null;
  stock_quantity: number;
  care_level: CareLevel;
  sunlight: string;
  water_frequency: string;
  indoor: boolean;
  is_pet_friendly: boolean;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface UICartItem extends Pick<Product, "id" | "name" | "price" | "image_url"> {
  quantity: number;
}

export interface Testimonial {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
}

export interface Inquiry {
  id: string;
  kind: InquiryKind;
  status: InquiryStatus;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  estimated_total: number;
  created_at: string;
  items?: InquiryItem[];
}

export interface InquiryItem {
  id?: string;
  inquiry_id?: string;
  product_id?: string | null;
  product_name: string;
  image_url?: string | null;
  quantity: number;
  unit_price: number;
}

export interface PlanInquiry {
  id: string;
  plan: string;
  status: InquiryStatus;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  created_at: string;
}

export interface CartInquiryInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  consent: boolean;
  website?: string;
  items: Array<{ productId: string; quantity: number }>;
}

export interface PlanInquiryInput {
  plan: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  consent: boolean;
  website?: string;
}
