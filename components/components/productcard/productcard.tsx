"use client";

import styles from "../Collections.module.css";

type Props = {
  item: {
    name: string;
    type: string;
    price: number;
  };
  isAdmin: boolean;
  collectionId: string;
  onDelete: (collectionId: string, productName: string) => void;
};

export default function ProductCard({
  item,
  isAdmin,
  collectionId,
  onDelete,
}: Props) {
  return (
    <div className={styles.itemCard}>
      <p className={styles.itemName}>{item.name}</p>
      <p className={styles.itemMeta}>{item.type}</p>
      <p className={styles.itemPrice}>{item.price} ₽</p>

      <button
        className={styles.button}
        type="button"
        onClick={() => console.log("Добавилось?")}
      >
        Добавить
      </button>

      {isAdmin && (
        <button
          className={styles.deleteBtn}
          type="button"
          onClick={() => onDelete(collectionId, item.name)}
        >
          Удалить товар
        </button>
      )}
    </div>
  );
}
