"use client";

import Image from "next/image";
import { useZaknafeinModal } from "./zaknafeinModalStore";
import { useZaknafeinCart } from "./zaknafeinCartStore";

export default function ZaknafeinProductModal() {
  const { product, isOpen, close } = useZaknafeinModal();
  const add = useZaknafeinCart((s) => s.add);

  if (!isOpen || !product) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 700,
          background: "#0b0b10",
          border: "1px solid rgba(199,166,255,0.2)",
          display: "flex",
          borderRadius: 12,
          overflow: "hidden",
          color: "#c7a6ff",
        }}
      >
        {/* LEFT */}
        <div style={{ flex: 1, padding: 20 }}>
          <h2>{product.name}</h2>

          <p style={{ opacity: 0.7 }}>
            {product.description || "Тьма не раскрывает всех секретов..."}
          </p>

          <h3 style={{ marginTop: 10 }}>{product.price} ₽</h3>

          <button
            onClick={() =>
              add({
                id: String(product.id),
                name: product.name,
                price: Number(product.price),
                image: product.image,
              })
            }
            style={{
              marginTop: 20,
              width: "100%",
              padding: 12,
              background: "rgba(160,110,255,0.25)",
              border: "1px solid rgba(199,166,255,0.4)",
              color: "#e6d6ff",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            В тьму
          </button>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, position: "relative", minHeight: 300 }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
