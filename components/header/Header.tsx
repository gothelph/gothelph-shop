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
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  navItems?: { href: string; label: string; className: string }[];
}

export default function Header({ navItems = [] }: HeaderProps) {
  const router = useRouter();
  const { items, setIsOpen } = useCart();
  const { isAuth, roles, logout, openAuthModal, userName } = useAuthContext();
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
              <NavigationMenuTrigger className="cursor-pointer">
                КАТАЛОГ
              </NavigationMenuTrigger>
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
              <button
                onClick={() => openAuthModal("register")}
                className="cursor-pointer hover:opacity-70 transition"
              >
                РЕГИСТРАЦИЯ
              </button>
              <button
                onClick={() => openAuthModal("login")}
                className="cursor-pointer hover:opacity-70 transition"
              >
                ВХОД
              </button>
            </>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-70 transition"
          >
            КОРЗИНА ({cartCount})
          </button>

          {isAuth && (
            <>
              <button
                onClick={logout}
                className="text-lg cursor-pointer hover:opacity-70 transition"
              >
                ВЫЙТИ
              </button>
              <span
                onClick={() => router.push("/profile")}
                className="text-lg cursor-pointer hover:opacity-70 transition"
              >
                {isAdmin ? "АДМИН" : userName}
              </span>
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="text-lg cursor-pointer hover:opacity-70 transition"
                >
                  УПРАВЛЕНИЕ
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
