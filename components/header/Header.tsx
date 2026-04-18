"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

type Props = {
  navItems: { href: string; label: string; className: string }[];
  onOpenAuth: (mode: "login" | "register") => void;
  onOpenCart: () => void;
  onLogout: () => void;
  isAuth: boolean;
  isAdmin: boolean;
  cartCount: number;
};

export default function Header({
  navItems,
  onOpenAuth,
  onOpenCart,
  onLogout,
  isAuth,
  isAdmin,
  cartCount,
}: Props) {
  return (
    <header className="w-full border-b sticky top-0 z-50 bg-white/80 backdrop-blur">
      <div className="relative max-w-6xl mx-auto flex items-center justify-between h-30 px-4">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Каталог (dropdown) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>КАТАЛОГ</NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="p-3 w-[200px] text-sm">Тут будут категории</div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* остальные пункты (якоря) */}
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <a
                  href={item.href}
                  className="px-3 py-2 ${item.className ?? text-lg} hover:opacity-70 transition"
                >
                  {item.label}
                </a>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* 🟣 ЛОГО ПО ЦЕНТРУ */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="font-bold text-lg">GOTHELPH</div>
        </div>

        {/* 🟡 ПРАВО (действия) */}
        <div className="flex items-center gap-4 text-lg">
          {!isAuth && (
            <>
              <button onClick={() => onOpenAuth("register")}>
                РЕГИСТРАЦИЯ
              </button>
              <button onClick={() => onOpenAuth("login")}>ВХОД</button>
            </>
          )}

          <button onClick={onOpenCart}>КОРЗИНА ({cartCount})</button>

          {isAuth && (
            <>
              <button onClick={onLogout}>выйти</button>
              <span className="text-xs text-gray-500">
                {isAdmin ? "Администратор" : "Пользователь"}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
