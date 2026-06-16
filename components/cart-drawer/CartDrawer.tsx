"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import styles from "./cart-drawer.module.css";
import { useAuthContext } from "@/hooks/useAuthContext";
import { SuccessModal } from "../SuccessModal/SuccessModal";

export function CartDrawer() {
  const router = useRouter();
  const { isAuth, accessToken } = useAuthContext();
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
    total,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  const handleOrder = async () => {
    if (!isAuth) {
      router.push("/checkout");
      setIsOpen(false);
      return;
    }

    try {
      await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ items }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      clearCart();
      setSuccessModalOpen(true);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <>
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      />
      <div className={styles.overlay} onClick={() => setIsOpen(false)}>
        <aside onClick={(e) => e.stopPropagation()} className={styles.drawer}>
          <div className={styles.header}>
            <h2 className={styles.btn}>Корзина</h2>
            <button onClick={() => setIsOpen(false)} className={styles.close}>
              &times;
            </button>
          </div>

          {items.length === 0 ? (
            <p className={styles.empty}>Корзина пуста</p>
          ) : (
            <>
              <div className={styles.items}>
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
                      <p className={styles.itemPrice}>{item.price} ₽</p>
                      <div className={styles.qtyControls}>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className={styles.remove}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.footer}>
                <p className={styles.total}>Итого: {total} ₽</p>
                <Button onClick={clearCart} variant="outline">
                  Очистить
                </Button>
                <Button onClick={handleOrder}>Оформить заказ</Button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
