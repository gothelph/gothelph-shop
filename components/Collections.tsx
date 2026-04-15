"use client";

import { FormEvent, useState } from "react";
import { Collection } from "@/types/collection";
import styles from "./components/Collections.module.css";
import ProductCard from "./components/productcard/productcard";

type Props = {
  data: Collection[];
  isAdmin: boolean;
  accessToken: string;
  onReload: () => Promise<void>;
};

export default function Collections({
  data,
  isAdmin,
  accessToken,
  onReload,
}: Props) {
  const [statusMessage, setStatusMessage] = useState("");

  const handleCollectionSave = async (
    e: FormEvent<HTMLFormElement>,
    collectionId: string,
  ) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();

    const response = await fetch("/api/collections", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ collectionId, title, description }),
    });

    if (!response.ok) {
      setStatusMessage("Не удалось обновить карточку коллекции.");
      return;
    }

    setStatusMessage("Карточка коллекции обновлена.");
    await onReload();
  };

  const handleDeleteProduct = async (
    collectionId: string,
    productName: string,
  ) => {
    const response = await fetch("/api/collections", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ collectionId, productName }),
    });

    if (!response.ok) {
      setStatusMessage("Не удалось удалить товар.");
      return;
    }

    setStatusMessage(`Товар "${productName}" удалён.`);
    await onReload();
  };

  if (data.length === 0) {
    return (
      <section id="collections" className={styles.section}>
        <h2 className={styles.title}>Коллекции</h2>
        <p className={styles.itemMeta}>Данные коллекций пока не загружены.</p>
      </section>
    );
  }

  return (
    <section id="collections" className={styles.section}>
      <h2 className={styles.title}>Коллекции</h2>
      {statusMessage && <p className={styles.itemMeta}>{statusMessage}</p>}

      {data.map((collection) => (
        <article key={collection.id} className={styles.collectionCard}>
          <h3 className={styles.collectionTitle}>{collection.title}</h3>
          <p className={styles.collectionDescription}>
            {collection.description}
          </p>

          {isAdmin && (
            <form
              className={styles.adminPanel}
              onSubmit={(e) => handleCollectionSave(e, collection.id)}
            >
              <div className={styles.adminFields}>
                <input
                  className={styles.input}
                  name="title"
                  defaultValue={collection.title}
                  placeholder="Название коллекции"
                />
                <input
                  className={styles.input}
                  name="description"
                  defaultValue={collection.description}
                  placeholder="Описание"
                />
              </div>
              <div className={styles.btnRow}>
                <button className={styles.adminBtn} type="submit">
                  Сохранить карточку
                </button>
              </div>
            </form>
          )}

          {collection.subcollections.map((sub) => (
            <div key={sub.id} className={styles.subcollection}>
              <h4 className={styles.subcollectionTitle}>{sub.title}</h4>
              <p className={styles.itemMeta}>{sub.description}</p>

              <div className={styles.itemsGrid}>
                {sub.items.map((item) => (
                  <ProductCard
                    key={item.name}
                    item={item}
                    isAdmin={isAdmin}
                    collectionId={collection.id}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}
