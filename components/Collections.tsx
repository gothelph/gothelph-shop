import { Collection } from "@/types/collection";
import styles from "./components/Collections.module.css";

type Props = {
  data: Collection[];
};

export default function Collections({ data }: Props) {
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

      {data.map((collection) => (
        <article key={collection.id} className={styles.collectionCard}>
          <h3 className={styles.collectionTitle}>{collection.title}</h3>
          <p className={styles.collectionDescription}>
            {collection.description}
          </p>

          {collection.subcollections.map((sub) => (
            <div key={sub.id} className={styles.subcollection}>
              <h4 className={styles.subcollectionTitle}>{sub.title}</h4>
              <p className={styles.itemMeta}>{sub.description}</p>

              <div className={styles.itemsGrid}>
                {sub.items.map((item) => (
                  <div key={item.name} className={styles.itemCard}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemMeta}>{item.type}</p>
                    <p className={styles.itemPrice}>{item.price} ₽</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}
