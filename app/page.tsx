"use client";

import { FormEvent, useMemo, useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import Collections from "@/components/Collections";
import { useAuth } from "@/hooks/useAuth";
import { Cover } from "@/components/components/cover/cover";
import { useCollections } from "@/hooks/useCollections";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

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

  const { collections, error: collectionsError, reload } = useCollections();

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

      <Cover />

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
        onReload={reload}
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
