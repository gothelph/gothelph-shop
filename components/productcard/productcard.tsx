"use client";
import styles from "./productcard.module.css";
import Image from "next/image";

type Props = {
  item: {
    id: string;
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
  const imageUrl = item.image && item.image !== "/placeholder.png" 
    ? item.image 
    : null;

  return (
    <div className={styles.itemCard}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            className={styles.image}
            width={300}
            height={200}
            unoptimized
          />
        ) : (
          <div className={styles.placeholder}>Нет фото</div>
        )}
      </div>

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
