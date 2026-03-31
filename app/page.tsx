"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import Collections from "@/components/Collections";
import { collectionsData } from "@/data/collections";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [cartItems, setCartItems] = useState([
    { id: 1, title: "Hoodie", size: "L", qty: 1, price: 5900 },
  ]);

  const total = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.price * i.qty, 0),
    [cartItems],
  );

  return (
    <div>
      <Header
        navItems={[
          { href: "#catalog", label: "каталог" },
          { href: "#collections", label: "коллекции" },
        ]}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={() => {}}
        isAuth={false}
        cartCount={cartItems.length}
      />

      <Collections data={collectionsData} />

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
        onLogin={() => {}}
        onRegister={() => {}}
        message=""
      />
    </div>
  );
}
