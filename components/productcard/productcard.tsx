"use client";

import styles from "./productcard.module.css";
import Image from "next/image";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  description?: string;
};

type Props = {
  item: Product;
  isAdmin: boolean;
  collectionId: string;
  onDelete: (collectionId: string, productName: string) => void;
  onUpdate?: (updated: Product) => void;
};

export default function ProductCard({
  item,
  isAdmin,
  collectionId,
  onDelete,
  onUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(item);
  const [uploading, setUploading] = useState(false);

  const imageUrl =
    item.image && item.image !== "/placeholder.png" ? item.image : null;

  const handleSave = async () => {
    const res = await fetch(`/api/products/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (onUpdate) onUpdate(data);
    setEditing(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    setForm((prev) => ({ ...prev, image: data.url }));
    setUploading(false);
  };

  return (
    <>
      <div
        className={styles.itemCard}
        onClick={() => isAdmin && setEditing(true)}
      >
        <div className={styles.imageWrapper}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              width={300}
              height={200}
              unoptimized
            />
          ) : (
            <div className={styles.placeholder}>Нет фото</div>
          )}
        </div>

        <p>{item.name}</p>
        <p>{item.type}</p>
        <p>{item.price} ₽</p>

        <button type="button">Добавить</button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => onDelete(collectionId, item.name)}
          >
            Удалить
          </button>
        )}
      </div>

      {editing && isAdmin && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Редактирование</h2>

            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />

            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />

            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="file"
              onChange={(e) =>
                e.target.files?.[0] && handleImageUpload(e.target.files[0])
              }
            />

            {uploading && <p>Загрузка...</p>}

            <button onClick={handleSave}>Сохранить</button>
            <button onClick={() => setEditing(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </>
  );
}
