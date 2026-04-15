"use client";
import styles from "./productcard.module.css";
import Image from "next/image";

type Props = {
  item: {
    name: string;
    type: string;
    price: number;
    image: string;
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
      <div className={styles.itemCard}>
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            className={styles.image}
            width={300}
            height={200}
          />
        )}

        <p className={styles.itemName}>{item.name}</p>
        <p className={styles.itemMeta}>{item.type}</p>
        <p className={styles.itemPrice}>{item.price} ₽</p>
      </div>

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
