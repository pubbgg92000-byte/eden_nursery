export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category_id?: string;
  category?: Category;
  stock_quantity: number;
  care_level: 'Easy' | 'Moderate' | 'Expert';
  sunlight: string;
  water_frequency: string;
  indoor: boolean;
  is_pet_friendly: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  profile?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  profile?: Profile;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface UICartItem extends Pick<Product, 'id' | 'name' | 'price' | 'image_url'> {
  quantity: number;
}

export interface Subscription {
  id: string;
  email: string;
  status: string;
  created_at: string;
}
