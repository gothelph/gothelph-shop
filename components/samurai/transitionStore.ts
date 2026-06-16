"use client";

import { create } from "zustand";

type TransitionState = {
  isAnimating: boolean;
  setAnimating: (v: boolean) => void;
};

export const useTransitionStore = create<TransitionState>((set) => ({
  isAnimating: false,
  setAnimating: (v) => set({ isAnimating: v }),
}));
