"use client";

import { useRouter } from "next/navigation";
import { useSamuraiCart } from "./samuraiCartStore";

export default function SamuraiCartDrawer() {
  const router = useRouter();
  const { isOpen, close, items, remove, clear } = useSamuraiCart();

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (!isOpen) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 9998,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: 360,
          background: "#111",
          color: "white",
          padding: 20,
        }}
      >
        <h2>Корзина самурая</h2>

        {items.map((i) => (
          <div key={i.id} style={{ marginBottom: 10 }}>
            <div>{i.name}</div>
            <div>
              {i.qty} × {i.price} ₽
            </div>

            <button onClick={() => remove(i.id)}>удалить</button>
          </div>
        ))}

        <h3 style={{ marginTop: 20 }}>Итого: {total} ₽</h3>

        <button
          onClick={() => router.push("/checkout")}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 10,
            background: "crimson",
            border: "none",
            color: "white",
          }}
        >
          Оформить заказ
        </button>

        <button onClick={clear} style={{ marginTop: 10 }}>
          очистить
        </button>
      </div>
    </div>
  );
}
