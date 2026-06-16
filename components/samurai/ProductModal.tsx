"use client";

import { useProductModal } from "./productModalStore";
import { useSamuraiCart } from "./cart/samuraiCartStore";
import Image from "next/image";
import styles from "./samurai.module.css";

export default function ProductModal() {
  const { product, isOpen, close } = useProductModal();
  const add = useSamuraiCart((s) => s.add);

  if (!isOpen || !product) return null;

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* LEFT */}
        <div className={styles.modalLeft}>
          <h2>{product.name}</h2>

          <p className={styles.desc}>{product.description}</p>

          <div className={styles.price}>{product.price} ₽</div>

          <button
            className={styles.buyBtn}
            onClick={() =>
              add({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
          >
            В корзину
          </button>
        </div>

        {/* RIGHT */}
        <div className={styles.modalRight}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={styles.modalImage}
          />
        </div>
      </div>
    </div>
  );
}
