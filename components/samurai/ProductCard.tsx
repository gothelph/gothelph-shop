"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./samurai.module.css";
import { useProductModal } from "./productModalStore";
import { useSamuraiCart } from "./cart/samuraiCartStore"; // 👈 ДОБАВЬ

export default function ProductCard({ product }: any) {
  const ref = useRef<HTMLDivElement | null>(null);
  const open = useProductModal((s) => s.open);
  const add = useSamuraiCart((s) => s.add); // 👈 ВОТ ЭТО

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -10;
    const rotateY = (x / rect.width - 0.5) * 10;

    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const reset = () => {
    const el = ref.current!;
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  const handleClick = () => {
    open(product);
  };

  return (
    <div
      ref={ref}
      className={styles.card}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.glow} />

      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={styles.image}
        />
      </div>

      <h3>{product.name}</h3>
      <p>{product.price}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();

          add({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          });
        }}
        className={styles.btn}
      >
        В корзину
      </button>
    </div>
  );
}
