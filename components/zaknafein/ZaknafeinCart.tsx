"use client";

import { useRouter } from "next/navigation";
import { useZaknafeinCart } from "./zaknafeinCartStore";

export default function ZaknafeinCart() {
  const router = useRouter();
  const { items, isOpen, open, close } = useZaknafeinCart();

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <button
        onClick={open}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          background: "rgba(140, 90, 200, 0.2)",
          color: "#c7a6ff",
          border: "1px solid rgba(199, 166, 255, 0.4)",
          padding: "10px 14px",
          borderRadius: 10,
          backdropFilter: "blur(10px)",
          cursor: "pointer",
        }}
      >
        Тьма ({items.length})
      </button>

      {isOpen && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: 0,
              top: 50,
              width: 380,
              height: "100%",
              background: "#0b0b10",
              color: "#c7a6ff",
              padding: 20,
              borderLeft: "1px solid rgba(199, 166, 255, 0.2)",
            }}
          >
            <h2>Корзина Zaknafein</h2>

            {items.map((i) => (
              <div key={i.id}>
                {i.name} × {i.qty}
              </div>
            ))}

            <h3>Итого: {total} ₽</h3>

            <button
              onClick={() => router.push("/checkout")}
              style={{
                width: "100%",
                marginTop: 10,
                padding: 12,
                background: "rgba(160, 110, 255, 0.25)",
                color: "#e6d6ff",
                border: "1px solid rgba(199, 166, 255, 0.4)",
                borderRadius: 10,
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              Оформить путь тьмы
            </button>
          </div>
        </div>
      )}
    </>
  );
}
