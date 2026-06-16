"use client";

import Image from "next/image";
import styles from "./zaknafein.module.css";
import { useZaknafeinCart } from "./zaknafeinCartStore";
import { useZaknafeinModal } from "./zaknafeinModalStore";

export default function ZaknafeinProductCard({ product }: any) {
  const add = useZaknafeinCart((s) => s.add);
  const open = useZaknafeinModal((s) => s.open);

  return (
    <div
      className={styles.card}
      onClick={() => open(product)} // 👈 ОТКРЫТИЕ МОДАЛКИ
    >
      <div className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={product.image}
          alt={product.name}
          fill
        />
      </div>

      <h3>{product.name}</h3>
      <p>{product.price} ₽</p>

      <button
        onClick={(e) => {
          e.stopPropagation(); // 👈 чтобы не открывалась модалка
          add({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          });
        }}
      >
        В тьму
      </button>
    </div>
  );
}
