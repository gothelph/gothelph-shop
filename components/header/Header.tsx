"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Logo } from "../logo";

type Props = {
  navItems?: { href: string; label: string; className: string }[];
};

export default function Header({ navItems = [] }: Props) {
  const { items, setIsOpen } = useCart();
  const { isAuth, roles, logout, openAuthModal } = useAuthContext();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = roles.includes("admin");

  const defaultNavItems = [
    { href: "/", label: "ГЛАВНАЯ", className: "text-lg" },
    { href: "/catalog", label: "КОЛЛЕКЦИИ", className: "text-lg" },
  ];

  const allNavItems = navItems.length > 0 ? navItems : defaultNavItems;

  return (
    <header className="w-full border-b sticky top-0 z-50 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-30 px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>КАТАЛОГ</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-3 w-[200px] text-sm">
                  <a href="/catalog" className="block py-1">
                    Все товары
                  </a>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {allNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <a
                  href={item.href}
                  className="px-3 py-2 hover:opacity-70 transition"
                >
                  {item.label}
                </a>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Logo />

        <div className="flex items-center gap-4 text-lg">
          {!isAuth && (
            <>
              <button onClick={() => openAuthModal("register")}>
                РЕГИСТРАЦИЯ
              </button>
              <button onClick={() => openAuthModal("login")}>ВХОД</button>
            </>
          )}

          <button onClick={() => setIsOpen(true)}>КОРЗИНА ({cartCount})</button>

          {isAuth && (
            <>
              <button onClick={logout}>выйти</button>
              <span className="text-xs">
                {isAdmin ? "АДМИН" : "ПОЛЬЗОВАТЕЛЬ"}
              </span>
              {isAdmin && (
                <a href="/admin/products" className="text-xs">
                  УПРАВЛЕНИЕ
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
