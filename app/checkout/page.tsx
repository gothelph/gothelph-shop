"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 просто визуал — без API
    clearCart();
    setSuccessModalOpen(true);
  };

  // ⚠️ важно: добавили !successModalOpen
  if (items.length === 0 && !successModalOpen) {
    return (
      <div>
        <Header
          navItems={[
            { href: "/catalog", label: "Catalog", className: "text-lg" },
          ]}
        />
        <div className={styles.container}>
          <p>Cart is empty</p>
          <Button onClick={() => window.history.back()}>Back to catalog</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        navItems={[
          { href: "/catalog", label: "Catalog", className: "text-lg" },
        ]}
      />

      <div className={styles.container}>
        <h1>Checkout</h1>

        <div className={styles.content}>
          <div className={styles.items}>
            <h2>Items</h2>

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
            <h2>Contact info</h2>

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

function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  // открытие
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
  }, [open]);

  // закрытие с анимацией
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // время анимации
  };

  if (!open) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: isVisible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        transition: "background 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "320px",
          textAlign: "center",

          transform: isVisible ? "scale(1)" : "scale(0.9)",
          opacity: isVisible ? 1 : 0,

          transition: "all 0.2s ease",
        }}
      >
        <h2>Спасибо за заказ 🎉</h2>
        <p>Мы скоро с вами свяжемся</p>

        <div style={{ marginTop: "16px" }}>
          <Button
            onClick={() => {
              handleClose();
              setTimeout(() => {
                window.location.href = "/";
              }, 200);
            }}
          >
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
}
