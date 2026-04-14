"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import Collections from "@/components/Collections";
import { Collection } from "@/types/collection";
import { useAuth } from "@/hooks/useAuth";

type CollectionsApiPayload = {
  data?: Collection[];
  source?: "db" | "fallback" | "db-error";
  error?: string;
};

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsError, setCollectionsError] = useState<string>("");

  const [cartItems, setCartItems] = useState([
    { id: 1, title: "Hoodie", size: "L", qty: 1, price: 5900 },
  ]);

  const {
    isAuth,
    roles,
    message,
    clearMessage,
    login,
    register,
    logout,
    accessToken,
  } = useAuth();

  const isAdmin = roles.includes("admin");

  const loadCollections = useCallback(async () => {
    try {
      const response = await fetch("/api/collections");
      const payload = (await response.json()) as CollectionsApiPayload;

      if (!response.ok) {
        setCollectionsError(
          payload.error || "Не удалось загрузить коллекции из БД.",
        );
        return;
      }

      if (payload.data?.length) {
        setCollections(payload.data);
        setCollectionsError("");
      } else {
        setCollectionsError("БД вернула пустой список коллекций.");
      }
    } catch (error) {
      console.error("Failed to load collections", error);
      setCollectionsError("Ошибка сети при загрузке коллекций.");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCollections();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCollections]);

  const total = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.price * i.qty, 0),
    [cartItems],
  );

  // Логин
  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const success = await login({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });

    if (success) {
      setIsAuthOpen(false);
      e.currentTarget.reset();
    }
    return success;
  };

  // Регистрация
  const onRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const success = await register({
      username: String(formData.get("username") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });

    if (success) {
      setAuthMode("login");
      e.currentTarget.reset();
    }
    return success;
  };

  return (
    <div>
      <Header
        navItems={[
          { href: "#catalog", label: "каталог" },
          { href: "#collections", label: "коллекции" },
        ]}
        onOpenAuth={(mode) => {
          clearMessage();
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={logout}
        isAuth={isAuth}
        isAdmin={isAdmin}
        cartCount={cartItems.length}
      />

      {collectionsError && (
        <p
          style={{
            color: "#b91c1c",
            maxWidth: "72rem",
            margin: "1rem auto",
            padding: "0 1rem",
          }}
        >
          {collectionsError}
        </p>
      )}

      <Collections
        data={collections}
        isAdmin={isAdmin}
        accessToken={accessToken}
        onReload={loadCollections}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onRemove={(id) =>
          setCartItems((prev) => prev.filter((i) => i.id !== id))
        }
        onClear={() => setCartItems([])}
        total={total}
      />

      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSwitch={setAuthMode}
        onLogin={onLogin}
        onRegister={onRegister}
        message={message}
      />
    </div>
  );
}
