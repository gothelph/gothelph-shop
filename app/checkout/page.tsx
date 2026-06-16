"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import styles from "./checkout.module.css";
import { useAuthContext } from "@/hooks/useAuthContext";
import { SuccessModal } from "@/components/SuccessModal/SuccessModal";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { accessToken } = useAuthContext();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, address, comment, items }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      clearCart();
      setSuccessModalOpen(true);
    } catch {}
  };

  // ⚠️ важно: добавили !successModalOpen
  if (items.length === 0 && !successModalOpen) {
    return (
      <div>
        <Header
          navItems={[
            {
              href: "/catalog",
              label: "ВЕРНУТЬСЯ К ТОВАРАМ",
              className: "text-lg",
            },
          ]}
        />
        <div className={styles.container}>
          <p>КОРЗИНА ПУСТА</p>
          <Button onClick={() => window.history.back()}>
            ВЕРУНТЬСЯ НА ГЛАВУЮС СТРАНИЦУ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        navItems={[
          {
            href: "/catalog",
            label: "ВЕРНУТЬСЯ К ТОВАРАМ",
            className: "text-lg",
          },
        ]}
      />

      <div className={styles.container}>
        <h1>ОФОРМЛЕНИЕ ЗАКАЗА</h1>

        <div className={styles.content}>
          <div className={styles.items}>
            <h2>ТОВАРЫ</h2>

            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>

                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p>
                    {item.price} x {item.quantity} ={" "}
                    {item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <p className={styles.total}>Total: {total}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>КОНТАКТЫ</h2>

            <label>
              Имя *
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Телефон *
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Адрес *
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>

            <label>
              Комментарии
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>

            <Button type="submit">Оформить заказ</Button>
          </form>
        </div>
      </div>

      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
}
