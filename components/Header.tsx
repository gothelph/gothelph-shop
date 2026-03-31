"use client";

import Link from "next/link";

type Props = {
  navItems: { href: string; label: string }[];
  onOpenAuth: (mode: "login" | "register") => void;
  onOpenCart: () => void;
  onLogout: () => void;
  isAuth: boolean;
  cartCount: number;
};

export default function Header({
  navItems,
  onOpenAuth,
  onOpenCart,
  onLogout,
  isAuth,
  cartCount,
}: Props) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8 md:px-10">
      <nav className="hidden gap-8 text-3xl font-medium md:flex">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-3">
        <div className="h-44 w-44 rounded border bg-neutral-200" />
        <p className="text-7xl tracking-wide">GOTHELPH</p>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => onOpenAuth("register")}>регистрация</button>
        <button onClick={() => onOpenAuth("login")}>вход</button>
        <button onClick={onOpenCart}>корзина ({cartCount})</button>
        {isAuth && <button onClick={onLogout}>выйти</button>}
      </div>
    </header>
  );
}
