import { create } from "zustand";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

type State = {
  product: Product | null;
  isOpen: boolean;

  open: (product: Product) => void;
  close: () => void;
};

export const useZaknafeinModal = create<State>((set) => ({
  product: null,
  isOpen: false,

  open: (product) =>
    set({
      product,
      isOpen: true,
    }),

  close: () =>
    set({
      product: null,
      isOpen: false,
    }),
}));
