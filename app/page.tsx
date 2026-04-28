"use client";

import { FormEvent, useMemo, useState } from "react";
import Header from "@/components/header/Header";
import AuthModal from "@/components/auth-modal/AuthModal";
import Collections from "@/components/collections/Collections";
import { useAuth } from "@/hooks/useAuth";
import { useCollections } from "@/hooks/useCollections";
import { CategoriesCarousel } from "@/components/carousel/carousel";
import { ParallaxHero } from "@/components/paralax";
import { Cover } from "@/components/cover";
import { Collage } from "@/components/collections/Collage";
import { Footer } from "@/components/footer";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

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

  const collageItems = collections.map((collection) => {
    const image = collection.subcollections?.[0]?.items?.[0]?.image || null;

    return {
      id: collection.id,
      title: collection.title,
      image,
    };
  });

  // Логин
  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const formData = new FormData(target);

    const success = await login({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });

    if (success) {
      setIsAuthOpen(false);
      target.reset();
    }
    return success;
  };

  // Регистрация
  const onRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const formData = new FormData(target);

    const success = await register({
      username: String(formData.get("username") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });

    if (success) {
      setAuthMode("login");
      target.reset();
    }
    return success;
  };

  return (
    <div>
      <Header
navItems={[
          { href: "/catalog", label: "КОЛЛЕКЦИИ", className: "text-lg" },
          { href: "#collections", label: "КОНТАКТЫ", className: "text-lg" },
        ]}
        onOpenAuth={(mode) => {
          clearMessage();
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onLogout={logout}
        isAuth={isAuth}
        isAdmin={isAdmin}
        userName="Иван"
      />

      <Cover />
      <ParallaxHero />

      <CategoriesCarousel
        categories={[
          { name: "Аксессуары", image: "/hero.jpg" },
          { name: "Одежда", image: "/hero2.jpg" },
          { name: "Игрушки", image: "/hero.jpg" },
        ]}
        onSelect={(cat) => console.log(cat)}
      />

{/* 🔥 ВИТРИНА (реальный коллаж) */}
      <Collage items={collageItems} />

      {/* 🧠 АДМИНКА */}
      <Collections
        data={collections}
        isAdmin={isAdmin}
        accessToken={accessToken}
        onReload={reload}
      />

      <Footer />

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
