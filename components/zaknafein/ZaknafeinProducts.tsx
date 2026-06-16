"use client";

import { useEffect, useState } from "react";
import ZaknafeinProductCard from "./ZaknafeinProductCard";
import styles from "./zaknafein.module.css";

export default function ZaknafeinProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/brands/2") // допустим Zaknafein = id 2
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  return (
    <section id="products" className={styles.products}>
      <h2>Артефакты Мензоберранзана</h2>

      <div className={styles.grid}>
        {products.map((p: any) => (
          <ZaknafeinProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
