"use client";

import { useRef } from "react";
import styles from "./samurai.module.css";

export default function ProductCard({ product }: any) {
  const ref = useRef<HTMLDivElement | null>(null);

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

  return (
    <div
      ref={ref}
      className={styles.card}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      <div className={styles.glow} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button>В корзину</button>
    </div>
  );
}
