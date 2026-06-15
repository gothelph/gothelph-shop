"use client";

import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import styles from "./AdminMenu.module.css";

export default function AdminMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const menuItems = [
    { href: "/admin/users", label: "Пользователи", className: "text-lg" },
    { href: "/admin/products", label: "Товары", className: "text-lg" },
  ];

  const handleClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className={styles.container}>
      {menuItems.map((c) =>
        <Button
          key={c.href}
          onClick={() => handleClick(c.href)}
          variant={pathname === c.href  ?  "default" : "outline"}
        >
          {c.label}
        </Button>)
      }
    </div>
  )
}
