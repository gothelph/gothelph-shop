"use client";

import Link from "next/link";
import styles from "./Header.module.css";

type Props = {
  navItems: { href: string; label: string }[];
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
    <header className={styles.header}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.brand}>
        <div className={styles.logo} />
        <p className={styles.title}>GOTHELPH</p>
      </div>

      <div className={styles.actions}>
        {!isAuth && (
          <>
            <button className={styles.btn} onClick={() => onOpenAuth("register")}>
              регистрация
            </button>
            <button className={styles.btn} onClick={() => onOpenAuth("login")}>
              вход
            </button>
          </>
        )}
        <button className={styles.btn} onClick={onOpenCart}>
          корзина ({cartCount})
        </button>
        {isAuth && <button className={styles.btn} onClick={onLogout}>выйти</button>}
        {isAuth && <span className={styles.role}>{isAdmin ? "Администратор" : "Пользователь"}</span>}
      </div>
    </header>
  );
}
