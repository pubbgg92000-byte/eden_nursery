import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/product';

interface State {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      scrollProgress: 0,
      setScrollProgress: (progress: number) => set({ scrollProgress: progress }),
      cart: [],
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            cart: state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
        ).filter(i => i.quantity > 0),
      })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'eden-nursery-storage',
    }
  )
);
