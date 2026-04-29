"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          comment,
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        clearCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (items.length === 0 && !submitted) {
    return (
      <div>
        <Header navItems={[{ href: "/catalog", label: "Catalog", className: "text-lg" }]} />
        <div className={styles.container}>
          <p>Cart is empty</p>
          <Button onClick={() => window.history.back()}>Back to catalog</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div>
        <Header navItems={[{ href: "/", label: "Main", className: "text-lg" }]} />
        <div className={styles.container}>
          <h1>Thank you for your order!</h1>
          <p>We will contact you soon.</p>
          <Link href="/">
            <Button>Main page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header navItems={[{ href: "/catalog", label: "Catalog", className: "text-lg" }]} />

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
                  <p>{item.price} x {item.quantity} = {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
            <p className={styles.total}>Total: {total}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Contact info</h2>

            <label>
              Name *
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Phone *
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
              Address *
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>

            <label>
              Comment
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>

            <Button type="submit">Place order</Button>
          </form>
        </div>
      </div>
    </div>
  );
}