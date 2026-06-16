import { create } from "zustand";

type Item = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

type CartState = {
  items: Item[];
  isOpen: boolean;

  open: () => void;
  close: () => void;

  add: (item: Omit<Item, "qty">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useSamuraiCart = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  add: (item) => {
    const items = get().items;
    const exists = items.find((i) => i.id === item.id);

    if (exists) {
      set({
        items: items.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        ),
      });
    } else {
      set({
        items: [...items, { ...item, qty: 1 }],
      });
    }
  },

  remove: (id) =>
    set({
      items: get().items.filter((i) => i.id !== id),
    }),

  clear: () => set({ items: [] }),
}));
