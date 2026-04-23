import { create } from 'zustand'

export type CartItem = {
  id: string; // SKU o Variant ID
  name: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  stripePriceId?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  addItem: (item) => set((state) => {
    const qty = item.quantity ?? 1;
    const existingItem = state.items.find(i => i.id === item.id)
    if (existingItem) {
      return { 
        items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i),
        isOpen: true
      }
    }
    return { items: [...state.items, { ...item, quantity: qty }], isOpen: true }
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity <= 0 
      ? state.items.filter(i => i.id !== id) 
      : state.items.map(i => i.id === id ? { ...i, quantity } : i)
  })),
  setIsOpen: (isOpen) => set({ isOpen }),
  clearCart: () => set({ items: [] })
}))
