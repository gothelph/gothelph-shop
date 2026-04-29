"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";

type AuthModalState = {
  isOpen: boolean;
  mode: "login" | "register";
};

type AuthContextType = ReturnType<typeof useAuthHook> & {
  authModal: AuthModalState;
  openAuthModal: (mode: "login" | "register") => void;
  closeAuthModal: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();
  const [authModal, setAuthModal] = useState<AuthModalState>({
    isOpen: false,
    mode: "login",
  });

  const openAuthModal = (mode: "login" | "register") => {
    auth.clearMessage();
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AuthContext.Provider value={{ ...auth, authModal, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}